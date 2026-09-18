import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updatePassword: (oldPasscode: string, newPasscode: string) => Promise<{ success: boolean; message: string }>;
}

const AUTH_STORAGE_KEY = 'jatibaraya_admin_token_v1';
const HASH_KEY = 'jatibaraya_admin_cred_hash';

// Default initial hash for demo/admin: default passcode "jatibaraya2026" or "admin123"
// We use a robust SHA-256 standard browser Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message + '_jatibaraya_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check existing valid session
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      try {
        const user = JSON.parse(token);
        if (user && user.id) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      } catch {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = async (passcode: string): Promise<{ success: boolean; message?: string }> => {
    if (!passcode || passcode.trim().length === 0) {
      return { success: false, message: 'Kata sandi tidak boleh kosong.' };
    }

    const inputHash = await sha256(passcode.trim());
    const storedHash = localStorage.getItem(HASH_KEY);

    // Initial default hashes accepted:
    // "jatibaraya2026" or "admin123" or custom stored
    const defaultHash1 = await sha256('jatibaraya2026');
    const defaultHash2 = await sha256('admin123');

    const isValid = storedHash
      ? inputHash === storedHash
      : inputHash === defaultHash1 || inputHash === defaultHash2;

    if (isValid) {
      const user: AdminUser = {
        id: 'admin-jatibaraya',
        username: 'admin',
        name: 'Pengurus Jatibaraya',
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, message: 'Kata sandi salah. Silakan coba kembali.' };
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updatePassword = async (
    oldPasscode: string,
    newPasscode: string
  ): Promise<{ success: boolean; message: string }> => {
    const oldHash = await sha256(oldPasscode.trim());
    const storedHash = localStorage.getItem(HASH_KEY);
    const defaultHash1 = await sha256('jatibaraya2026');
    const defaultHash2 = await sha256('admin123');

    const isValid = storedHash
      ? oldHash === storedHash
      : oldHash === defaultHash1 || oldHash === defaultHash2;

    if (!isValid) {
      return { success: false, message: 'Kata sandi lama tidak sesuai.' };
    }

    if (newPasscode.trim().length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    const newHash = await sha256(newPasscode.trim());
    localStorage.setItem(HASH_KEY, newHash);
    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, updatePassword }}>
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
