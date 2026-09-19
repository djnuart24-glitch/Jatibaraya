import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AdminUser, AdminSession, AdminCredentialData } from '../types';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { recordAuditLog } from '../services/auditService';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  currentSession: AdminSession | null;
  cloudSyncStatus: 'synced' | 'pending' | 'offline';
  login: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updatePassword: (oldPasscode: string, newPasscode: string) => Promise<{ success: boolean; message: string }>;
  sessionRemainingMinutes: number;
}

const SESSION_STORAGE_KEY = 'jatibaraya_admin_session_v2';
const LEGACY_STORAGE_KEY = 'jatibaraya_admin_token_v1';
const LOCAL_CRED_KEY = 'jatibaraya_cloud_cred_hash';
const FIRESTORE_COLLECTION = 'content';
const FIRESTORE_DOC_ID = 'credentials';

// Session lifetime: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Web Crypto SHA-256
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message + '_jatibaraya_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `jb_sess_${crypto.randomUUID().replace(/-/g, '')}`;
    }
  } catch {
    // Fallback below
  }
  return `jb_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [currentSession, setCurrentSession] = useState<AdminSession | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'pending' | 'offline'>('pending');
  const [cloudCredential, setCloudCredential] = useState<AdminCredentialData | null>(null);
  const [sessionRemainingMinutes, setSessionRemainingMinutes] = useState<number>(1440);

  const isInitialCredentialLoadRef = useRef(true);

  // 1. Listen to real-time credential updates from Firestore (Cross-device sync)
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as AdminCredentialData;
            setCloudCredential(data);
            try {
              localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(data));
            } catch {
              // Ignore quota
            }
            setCloudSyncStatus('synced');
          } else {
            // First time: if not in Firestore, load from local fallback cache
            try {
              const cached = localStorage.getItem(LOCAL_CRED_KEY);
              if (cached) {
                setCloudCredential(JSON.parse(cached));
              }
            } catch {
              // Fallback
            }
            setCloudSyncStatus('synced');
          }
          isInitialCredentialLoadRef.current = false;
        },
        (error) => {
          console.warn('Firestore credentials snapshot error (offline fallback):', error);
          setCloudSyncStatus('offline');
          // Load from local storage cache if available
          try {
            const cached = localStorage.getItem(LOCAL_CRED_KEY);
            if (cached) {
              setCloudCredential(JSON.parse(cached));
            }
          } catch {
            // Ignore
          }
          isInitialCredentialLoadRef.current = false;
        }
      );
    } catch (err) {
      console.warn('Gagal koneksi Firestore untuk kredensial:', err);
      setCloudSyncStatus('offline');
      isInitialCredentialLoadRef.current = false;
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Validate Session Token on boot & periodically
  useEffect(() => {
    const validateExistingSession = () => {
      // Check v2 session token in localStorage first (shared across tabs)
      let sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);

      // Fallback check v1 legacy sessionStorage
      if (!sessionStr) {
        const legacyToken = sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyToken) {
          try {
            const legacyUser = JSON.parse(legacyToken);
            if (legacyUser && legacyUser.id) {
              // Upgrade legacy session to v2
              const upgradedSession: AdminSession = {
                token: generateSessionToken(),
                user: legacyUser,
                createdAt: Date.now(),
                expiresAt: Date.now() + SESSION_TTL_MS,
                lastActive: Date.now(),
              };
              sessionStr = JSON.stringify(upgradedSession);
              localStorage.setItem(SESSION_STORAGE_KEY, sessionStr);
              sessionStorage.removeItem(LEGACY_STORAGE_KEY);
            }
          } catch {
            sessionStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        }
      }

      if (sessionStr) {
        try {
          const session: AdminSession = JSON.parse(sessionStr);
          const now = Date.now();

          // Check if session has expired (TTL)
          if (!session.expiresAt || now > session.expiresAt) {
            console.info('Sesi login admin telah kedaluwarsa.');
            localStorage.removeItem(SESSION_STORAGE_KEY);
            sessionStorage.removeItem(LEGACY_STORAGE_KEY);
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentSession(null);
            setSessionRemainingMinutes(0);
            return;
          }

          // Valid session! Roll expiry if active (up to 24h)
          const remainingMinutes = Math.max(1, Math.round((session.expiresAt - now) / (60 * 1000)));
          setSessionRemainingMinutes(remainingMinutes);

          // Update lastActive timestamp if more than 5 minutes elapsed
          if (now - session.lastActive > 5 * 60 * 1000) {
            session.lastActive = now;
            session.expiresAt = now + SESSION_TTL_MS;
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          }

          setIsAuthenticated(true);
          setCurrentUser(session.user);
          setCurrentSession(session);
        } catch {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setIsAuthenticated(false);
          setCurrentUser(null);
          setCurrentSession(null);
        }
      }
    };

    validateExistingSession();

    // Check expiration every 60 seconds
    const interval = setInterval(validateExistingSession, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to verify a passcode against cloud or default hashes
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    const inputHash = await sha256(passcode.trim());

    // 1. If cloud credential exists in state or local cache, check it
    if (cloudCredential && cloudCredential.passwordHash) {
      if (inputHash === cloudCredential.passwordHash) {
        return true;
      }
    }

    // 2. Also check direct localStorage cache in case Firestore is still booting
    try {
      const cached = localStorage.getItem(LOCAL_CRED_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as AdminCredentialData;
        if (parsed.passwordHash && inputHash === parsed.passwordHash) {
          return true;
        }
      }
    } catch {
      // Ignore
    }

    // 3. Fallback default hashes (for first run or standard defaults)
    const defaultHash1 = await sha256('jatibaraya2026');
    const defaultHash2 = await sha256('admin123');

    if (inputHash === defaultHash1 || inputHash === defaultHash2) {
      return true;
    }

    return false;
  };

  const login = async (passcode: string): Promise<{ success: boolean; message?: string }> => {
    if (!passcode || passcode.trim().length === 0) {
      return { success: false, message: 'Kata sandi tidak boleh kosong.' };
    }

    // If cloud credential not yet loaded from Firestore, attempt quick fetch
    if (!cloudCredential) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as AdminCredentialData;
          setCloudCredential(data);
          localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(data));
        }
      } catch (e) {
        console.warn('Tidak dapat mengambil kredensial cloud secara langsung:', e);
      }
    }

    const isValid = await verifyPasscode(passcode);

    if (isValid) {
      const now = Date.now();
      const user: AdminUser = {
        id: 'admin-jatibaraya',
        username: 'admin',
        name: 'Pengurus Jatibaraya',
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
      };

      const sessionToken = generateSessionToken();
      const session: AdminSession = {
        token: sessionToken,
        user,
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS,
        lastActive: now,
        credentialVersion: cloudCredential?.version || now,
      };

      // Store in localStorage for multi-tab support and persistence
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      // Also store in sessionStorage for backwards compatibility
      sessionStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(user));

      setIsAuthenticated(true);
      setCurrentUser(user);
      setCurrentSession(session);
      setSessionRemainingMinutes(1440);

      // If cloud credentials did not exist yet, initialize it in Firestore
      if (!cloudCredential || !cloudCredential.passwordHash) {
        try {
          const inputHash = await sha256(passcode.trim());
          const newCred: AdminCredentialData = {
            passwordHash: inputHash,
            updatedAt: new Date().toISOString(),
            updatedBy: user.name,
            version: now,
          };
          const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
          await setDoc(docRef, newCred, { merge: true });
          setCloudCredential(newCred);
          localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(newCred));
        } catch (err) {
          console.warn('Gagal inisialisasi awal kredensial ke Firestore:', err);
        }
      }

      // Record Audit Trail
      recordAuditLog(
        'LOGIN',
        'auth',
        'Admin berhasil masuk ke CMS Dashboard',
        `Sesi dibuat dengan token ID: ${sessionToken.substring(0, 16)}...`,
        user
      ).catch(() => {});

      return { success: true };
    }

    return { success: false, message: 'Kata sandi salah. Silakan periksa kembali atau gunakan kata sandi yang telah disinkronkan.' };
  };

  const logout = () => {
    // Record audit log before cleaning up
    if (currentUser) {
      recordAuditLog(
        'LOGOUT',
        'auth',
        'Admin keluar dari sesi CMS Dashboard',
        'Sesi token berhasil dinonaktifkan',
        currentUser
      ).catch(() => {});
    }

    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentSession(null);
    setSessionRemainingMinutes(0);
  };

  const updatePassword = async (
    oldPasscode: string,
    newPasscode: string
  ): Promise<{ success: boolean; message: string }> => {
    const isOldValid = await verifyPasscode(oldPasscode);
    if (!isOldValid) {
      return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
    }

    if (newPasscode.trim().length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    try {
      const newHash = await sha256(newPasscode.trim());
      const newVersion = Date.now();
      const updatedCred: AdminCredentialData = {
        passwordHash: newHash,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'Pengurus Jatibaraya',
        version: newVersion,
      };

      // 1. Sync directly to Cloud Firestore (Available to ALL devices in real time)
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(docRef, updatedCred, { merge: true });

      // 2. Update local state and cache
      setCloudCredential(updatedCred);
      localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(updatedCred));

      // 3. Update current session's credential version
      if (currentSession) {
        const updatedSession = { ...currentSession, credentialVersion: newVersion };
        setCurrentSession(updatedSession);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
      }

      // 4. Record Audit Log
      recordAuditLog(
        'UPDATE_PASSWORD',
        'auth',
        'Kata sandi portal pengurus berhasil diperbarui',
        'Kredensial baru telah disinkronkan secara real-time ke cloud database dan seluruh perangkat.',
        currentUser || undefined
      ).catch(() => {});

      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui dan telah disinkronkan ke seluruh perangkat (Cloud Firestore)!',
      };
    } catch (err: any) {
      console.error('Gagal memperbarui kata sandi ke cloud:', err);
      return {
        success: false,
        message: 'Gagal memperbarui kata sandi ke cloud database: ' + (err?.message || 'Koneksi terganggu'),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentSession,
        cloudSyncStatus,
        login,
        logout,
        updatePassword,
        sessionRemainingMinutes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
