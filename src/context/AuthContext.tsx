import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AdminUser,
  AdminSession,
  AdminCredentialData,
  AuthorizedAdminEmail,
  AuthorizedAdminsDoc,
} from '../types';
import { db, auth, googleProvider } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { recordAuditLog } from '../services/auditService';

export const PRIMARY_SUPERADMIN_EMAIL = 'jatibaraya1910@gmail.com';
export const RENEWED_ADMIN_PASSWORD = 'Jatibaraya1910!';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  currentSession: AdminSession | null;
  cloudSyncStatus: 'synced' | 'pending' | 'offline';
  authorizedAdmins: AuthorizedAdminEmail[];
  primaryAdminEmail: string;
  isPrimaryAdmin: boolean;
  login: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string; user?: AdminUser }>;
  logout: () => void;
  updatePassword: (oldPasscode: string, newPasscode: string) => Promise<{ success: boolean; message: string }>;
  addAuthorizedAdmin: (
    email: string,
    name: string,
    role?: 'admin' | 'superadmin',
    notes?: string
  ) => Promise<{ success: boolean; message: string }>;
  removeAuthorizedAdmin: (email: string) => Promise<{ success: boolean; message: string }>;
  sessionRemainingMinutes: number;
}

const SESSION_STORAGE_KEY = 'jatibaraya_admin_session_v2';
const LEGACY_STORAGE_KEY = 'jatibaraya_admin_token_v1';
const LOCAL_CRED_KEY = 'jatibaraya_cloud_cred_hash';
const FIRESTORE_COLLECTION = 'content';
const FIRESTORE_DOC_CREDENTIALS = 'credentials';
const FIRESTORE_DOC_ADMINS = 'authorized_admins';

// Session lifetime: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Web Crypto SHA-256 with Jatibaraya salt
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
  const [authorizedAdmins, setAuthorizedAdmins] = useState<AuthorizedAdminEmail[]>([]);
  const [sessionRemainingMinutes, setSessionRemainingMinutes] = useState<number>(1440);

  const isInitialCredentialLoadRef = useRef(true);

  // 1. Listen to real-time credential updates from Firestore
  useEffect(() => {
    let unsubscribeCred: (() => void) | null = null;
    let unsubscribeAdmins: (() => void) | null = null;

    try {
      const credDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_CREDENTIALS);
      unsubscribeCred = onSnapshot(
        credDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as AdminCredentialData;
            setCloudCredential(data);
            try {
              localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(data));
            } catch {
              // Ignore
            }
            setCloudSyncStatus('synced');
          } else {
            // First time: initialize with renewed master password hash in Firestore
            sha256(RENEWED_ADMIN_PASSWORD).then((hash) => {
              const initCred: AdminCredentialData = {
                passwordHash: hash,
                updatedAt: new Date().toISOString(),
                updatedBy: 'Sistem Inisialisasi Jatibaraya',
                version: Date.now(),
              };
              setDoc(credDocRef, initCred, { merge: true }).catch(() => {});
              setCloudCredential(initCred);
              try {
                localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(initCred));
              } catch {
                // Ignore
              }
            });
            setCloudSyncStatus('synced');
          }
          isInitialCredentialLoadRef.current = false;
        },
        (error) => {
          console.warn('Firestore credentials snapshot error (offline fallback):', error);
          setCloudSyncStatus('offline');
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

      // Listen to real-time authorized admin accounts list
      const adminsDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ADMINS);
      unsubscribeAdmins = onSnapshot(
        adminsDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as AuthorizedAdminsDoc;
            setAuthorizedAdmins(data.admins || []);
          } else {
            // Initialize document with primary admin jatibaraya1910@gmail.com
            const initAdminsDoc: AuthorizedAdminsDoc = {
              primaryAdmin: PRIMARY_SUPERADMIN_EMAIL,
              admins: [],
              updatedAt: new Date().toISOString(),
            };
            setDoc(adminsDocRef, initAdminsDoc, { merge: true }).catch(() => {});
            setAuthorizedAdmins([]);
          }
        },
        (error) => {
          console.warn('Firestore authorized_admins snapshot error:', error);
        }
      );
    } catch (err) {
      console.warn('Gagal koneksi Firestore untuk kredensial & admins:', err);
      setCloudSyncStatus('offline');
      isInitialCredentialLoadRef.current = false;
    }

    return () => {
      if (unsubscribeCred) unsubscribeCred();
      if (unsubscribeAdmins) unsubscribeAdmins();
    };
  }, []);

  // 2. Validate Session Token on boot & periodically
  useEffect(() => {
    const validateExistingSession = () => {
      let sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);

      if (!sessionStr) {
        const legacyToken = sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyToken) {
          try {
            const legacyUser = JSON.parse(legacyToken);
            if (legacyUser && legacyUser.id) {
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

          const remainingMinutes = Math.max(1, Math.round((session.expiresAt - now) / (60 * 1000)));
          setSessionRemainingMinutes(remainingMinutes);

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
    const interval = setInterval(validateExistingSession, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to verify a passcode against renewed master password or cloud hashes
  const verifyPasscode = async (passcode: string, activeCred?: AdminCredentialData | null): Promise<boolean> => {
    const cleanPass = passcode.trim();
    const inputHash = await sha256(cleanPass);

    // 1. Check against the renewed designated master password
    const renewedHash1 = await sha256(RENEWED_ADMIN_PASSWORD);
    const renewedHash2 = await sha256(RENEWED_ADMIN_PASSWORD.replace('!', ''));
    if (cleanPass === RENEWED_ADMIN_PASSWORD || inputHash === renewedHash1 || inputHash === renewedHash2) {
      return true;
    }

    // 2. Check against active credential from Firestore
    if (activeCred && activeCred.passwordHash) {
      if (inputHash === activeCred.passwordHash) {
        return true;
      }
    }

    // 3. Check in-memory cloudCredential state
    if (cloudCredential && cloudCredential.passwordHash) {
      if (inputHash === cloudCredential.passwordHash) {
        return true;
      }
    }

    // 4. Check localStorage fallback cache
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

    return false;
  };

  // Login using Passcode
  const login = async (passcode: string): Promise<{ success: boolean; message?: string }> => {
    if (!passcode || passcode.trim().length === 0) {
      return { success: false, message: 'Kata sandi tidak boleh kosong.' };
    }

    let activeCred: AdminCredentialData | null = null;
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_CREDENTIALS);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        activeCred = snap.data() as AdminCredentialData;
        setCloudCredential(activeCred);
        try {
          localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(activeCred));
        } catch {
          // Ignore
        }
      }
    } catch (e) {
      console.warn('Gagal membaca kredensial cloud secara langsung:', e);
    }

    if (!activeCred) activeCred = cloudCredential;
    if (!activeCred) {
      try {
        const cached = localStorage.getItem(LOCAL_CRED_KEY);
        if (cached) activeCred = JSON.parse(cached) as AdminCredentialData;
      } catch {
        // Ignore
      }
    }

    const isValid = await verifyPasscode(passcode, activeCred);

    if (isValid) {
      const now = Date.now();
      const user: AdminUser = {
        id: 'admin-jatibaraya',
        username: 'admin',
        name: 'Pengurus Jatibaraya',
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
        loginMethod: 'password',
      };

      const sessionToken = generateSessionToken();
      const session: AdminSession = {
        token: sessionToken,
        user,
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS,
        lastActive: now,
        credentialVersion: activeCred?.version || cloudCredential?.version || now,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      sessionStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(user));

      setIsAuthenticated(true);
      setCurrentUser(user);
      setCurrentSession(session);
      setSessionRemainingMinutes(1440);

      // Ensure cloud has the renewed password hash synced
      try {
        const inputHash = await sha256(passcode.trim());
        const newCred: AdminCredentialData = {
          passwordHash: inputHash,
          updatedAt: new Date().toISOString(),
          updatedBy: user.name,
          version: now,
        };
        const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_CREDENTIALS);
        await setDoc(docRef, newCred, { merge: true });
        setCloudCredential(newCred);
        localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(newCred));
      } catch (err) {
        console.warn('Gagal sinkronisasi kredensial ke Firestore:', err);
      }

      recordAuditLog(
        'LOGIN',
        'auth',
        'Admin berhasil masuk ke Portal Admin menggunakan kata sandi',
        `Sesi dibuat dengan token ID: ${sessionToken.substring(0, 16)}...`,
        user
      ).catch(() => {});

      return { success: true };
    }

    return {
      success: false,
      message: 'Kata sandi tidak sesuai. Silakan gunakan kata sandi resmi terbaru: ' + RENEWED_ADMIN_PASSWORD,
    };
  };

  // Login using Google (Gmail) - Strictly validates jatibaraya1910@gmail.com and whitelisted admins
  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string; user?: AdminUser }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;
      const email = (gUser.email || '').toLowerCase().trim();

      if (!email) {
        await fbSignOut(auth).catch(() => {});
        return { success: false, message: 'Gagal memperoleh alamat email dari akun Google Anda.' };
      }

      // 1. Check if email matches the designated primary admin
      const isPrimary = email === PRIMARY_SUPERADMIN_EMAIL.toLowerCase().trim();

      // 2. Fetch latest whitelist from Firestore to prevent stale in-memory state
      let currentApprovedList = authorizedAdmins;
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ADMINS);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as AuthorizedAdminsDoc;
          if (data && Array.isArray(data.admins)) {
            currentApprovedList = data.admins;
            setAuthorizedAdmins(data.admins);
          }
        }
      } catch (e) {
        console.warn('Gagal membaca dokumen authorized_admins:', e);
      }

      // 3. Check if email is in the approved list
      const approvedEntry = currentApprovedList.find(
        (item) => item.email.toLowerCase().trim() === email && item.status === 'active'
      );

      // If NOT primary admin and NOT in approved whitelist -> STRICT ACCESS DENIAL
      if (!isPrimary && !approvedEntry) {
        await fbSignOut(auth).catch(() => {});
        return {
          success: false,
          message: `Akses ditolak! Akun Google (${email}) belum didaftarkan sebagai admin oleh Admin Utama (${PRIMARY_SUPERADMIN_EMAIL}). Hanya akun Gmail yang diajukan oleh Admin Utama yang dapat mengakses portal ini.`,
        };
      }

      // Approved! Construct AdminUser
      const now = Date.now();
      const adminRole: 'superadmin' | 'admin' = isPrimary || approvedEntry?.role === 'superadmin' ? 'superadmin' : 'admin';
      const adminName =
        gUser.displayName ||
        approvedEntry?.name ||
        (isPrimary ? 'Admin Utama Jatibaraya' : 'Pengurus Jatibaraya');

      const adminUser: AdminUser = {
        id: `g_${gUser.uid}`,
        username: email.split('@')[0],
        name: adminName,
        email: email,
        photoURL: gUser.photoURL || undefined,
        role: adminRole,
        lastLogin: new Date().toISOString(),
        loginMethod: 'google',
      };

      const sessionToken = generateSessionToken();
      const session: AdminSession = {
        token: sessionToken,
        user: adminUser,
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS,
        lastActive: now,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      sessionStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(adminUser));

      setIsAuthenticated(true);
      setCurrentUser(adminUser);
      setCurrentSession(session);
      setSessionRemainingMinutes(1440);

      recordAuditLog(
        'LOGIN_GOOGLE',
        'auth',
        `Admin masuk dengan Akun Google: ${email} (${adminRole})`,
        `Verifikasi whitelist sukses. Akun: ${email}`,
        adminUser
      ).catch(() => {});

      return { success: true, user: adminUser };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Jendela login Google ditutup sebelum proses selesai.' };
      }
      return {
        success: false,
        message: 'Gagal masuk dengan Google: ' + (err?.message || 'Koneksi terganggu. Silakan coba lagi.'),
      };
    }
  };

  const logout = () => {
    if (currentUser) {
      recordAuditLog(
        'LOGOUT',
        'auth',
        `Admin keluar dari sesi: ${currentUser.name} (${currentUser.username})`,
        'Sesi token berhasil dinonaktifkan',
        currentUser
      ).catch(() => {});
    }

    fbSignOut(auth).catch(() => {});
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
    let currentCred: AdminCredentialData | null = null;
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_CREDENTIALS);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        currentCred = snap.data() as AdminCredentialData;
        setCloudCredential(currentCred);
      }
    } catch (e) {
      console.warn('Gagal membaca kredensial saat update password:', e);
    }
    if (!currentCred) currentCred = cloudCredential;

    const isOldValid = await verifyPasscode(oldPasscode, currentCred);
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

      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_CREDENTIALS);
      await setDoc(docRef, updatedCred, { merge: true });

      setCloudCredential(updatedCred);
      try {
        localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify(updatedCred));
      } catch {
        // Ignore
      }

      if (currentSession) {
        const updatedSession = { ...currentSession, credentialVersion: newVersion };
        setCurrentSession(updatedSession);
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
        } catch {
          // Ignore
        }
      }

      recordAuditLog(
        'UPDATE_PASSWORD',
        'auth',
        'Kata sandi portal pengurus berhasil diperbarui',
        'Kredensial baru telah disinkronkan secara real-time ke cloud database.',
        currentUser || undefined
      ).catch(() => {});

      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui dan disinkronkan ke seluruh perangkat!',
      };
    } catch (err: any) {
      console.error('Gagal memperbarui kata sandi ke cloud:', err);
      return {
        success: false,
        message: 'Gagal memperbarui kata sandi: ' + (err?.message || 'Koneksi terganggu'),
      };
    }
  };

  // Add Authorized Admin Gmail (Must be called by primary super admin or superadmin)
  const addAuthorizedAdmin = async (
    email: string,
    name: string,
    role: 'admin' | 'superadmin' = 'admin',
    notes: string = ''
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Format alamat email tidak valid.' };
    }

    if (cleanEmail === PRIMARY_SUPERADMIN_EMAIL.toLowerCase().trim()) {
      return { success: false, message: `${PRIMARY_SUPERADMIN_EMAIL} adalah Admin Utama permanen.` };
    }

    if (authorizedAdmins.some((a) => a.email.toLowerCase().trim() === cleanEmail)) {
      return { success: false, message: `Email ${cleanEmail} sudah ada dalam daftar admin terdaftar.` };
    }

    const newAdminItem: AuthorizedAdminEmail = {
      id: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      name: name.trim() || 'Pengurus Jatibaraya',
      role,
      addedBy: currentUser?.email || currentUser?.name || PRIMARY_SUPERADMIN_EMAIL,
      addedAt: new Date().toISOString(),
      status: 'active',
      notes: notes.trim() || undefined,
    };

    const updatedList = [newAdminItem, ...authorizedAdmins];

    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ADMINS);
      await setDoc(
        docRef,
        {
          primaryAdmin: PRIMARY_SUPERADMIN_EMAIL,
          admins: updatedList,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setAuthorizedAdmins(updatedList);

      recordAuditLog(
        'ADD_ADMIN',
        'auth',
        `Admin baru diajukan dan didaftarkan: ${cleanEmail}`,
        `Nama: ${newAdminItem.name}, Peran: ${role}, Diajukan oleh: ${newAdminItem.addedBy}`,
        currentUser || undefined
      ).catch(() => {});

      return {
        success: true,
        message: `Akun Google (${cleanEmail}) berhasil didaftarkan sebagai admin resmi! Pengguna ini sekarang dapat login via Google.`,
      };
    } catch (err: any) {
      console.error('Gagal menambahkan admin ke Firestore:', err);
      return {
        success: false,
        message: 'Gagal menyimpan ke cloud database: ' + (err?.message || 'Koneksi terganggu'),
      };
    }
  };

  // Remove / Revoke Admin Gmail
  const removeAuthorizedAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === PRIMARY_SUPERADMIN_EMAIL.toLowerCase().trim()) {
      return { success: false, message: 'Admin Utama tidak dapat dihapus.' };
    }

    const updatedList = authorizedAdmins.filter((a) => a.email.toLowerCase().trim() !== cleanEmail);

    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ADMINS);
      await setDoc(
        docRef,
        {
          primaryAdmin: PRIMARY_SUPERADMIN_EMAIL,
          admins: updatedList,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setAuthorizedAdmins(updatedList);

      recordAuditLog(
        'REMOVE_ADMIN',
        'auth',
        `Izin akses admin dicabut untuk: ${cleanEmail}`,
        `Dihapus oleh: ${currentUser?.email || currentUser?.name || 'Admin Utama'}`,
        currentUser || undefined
      ).catch(() => {});

      return {
        success: true,
        message: `Izin akses admin untuk ${cleanEmail} berhasil dicabut. Akun ini tidak lagi dapat login ke portal.`,
      };
    } catch (err: any) {
      console.error('Gagal menghapus admin dari Firestore:', err);
      return {
        success: false,
        message: 'Gagal mencabut izin admin: ' + (err?.message || 'Koneksi terganggu'),
      };
    }
  };

  const isPrimaryAdmin =
    (currentUser?.email?.toLowerCase().trim() === PRIMARY_SUPERADMIN_EMAIL.toLowerCase().trim()) ||
    currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentSession,
        cloudSyncStatus,
        authorizedAdmins,
        primaryAdminEmail: PRIMARY_SUPERADMIN_EMAIL,
        isPrimaryAdmin,
        login,
        loginWithGoogle,
        logout,
        updatePassword,
        addAuthorizedAdmin,
        removeAuthorizedAdmin,
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
