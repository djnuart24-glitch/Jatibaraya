import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AuditLogCategory, AuditLogItem, AdminUser, AdminSession } from '../types';

const AUDIT_STORAGE_KEY = 'jatibaraya_audit_logs_cache';
const FIRESTORE_COLLECTION = 'content';
const FIRESTORE_DOC_ID = 'audit_logs';

function getDeviceInfo(): string {
  try {
    const ua = navigator.userAgent;
    let browser = 'Browser';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const platform = isMobile ? 'Mobile' : 'Desktop';
    return `${platform} (${browser})`;
  } catch {
    return 'Web Client';
  }
}

function getCurrentActor(): AdminUser {
  try {
    const sessionStr = localStorage.getItem('jatibaraya_admin_session_v2') || sessionStorage.getItem('jatibaraya_admin_token_v1');
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      if (parsed.user) return parsed.user;
      if (parsed.username) return parsed;
    }
  } catch {
    // Ignore error
  }

  return {
    id: 'admin-jatibaraya',
    username: 'admin',
    name: 'Pengurus Jatibaraya',
    role: 'superadmin',
  };
}

export function getCachedAuditLogs(): AuditLogItem[] {
  try {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore error
  }
  return [];
}

/**
 * Record a new audit log entry both to Firestore and locally
 */
export async function recordAuditLog(
  action: string,
  category: AuditLogCategory,
  description: string,
  details?: string,
  actorOverride?: AdminUser
): Promise<AuditLogItem> {
  const actor = actorOverride || getCurrentActor();
  const newLog: AuditLogItem = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    category,
    actor: {
      id: actor.id,
      name: actor.name,
      username: actor.username,
      role: actor.role,
    },
    description,
    details,
    deviceInfo: getDeviceInfo(),
  };

  // 1. Update local cache immediately
  try {
    const current = getCachedAuditLogs();
    const updated = [newLog, ...current].slice(0, 200);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore quota errors
  }

  // 2. Persist to Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    const docSnap = await getDoc(docRef);
    let logs: AuditLogItem[] = [];
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.logs)) {
        logs = data.logs;
      }
    }
    const mergedLogs = [newLog, ...logs.filter((l) => l.id !== newLog.id)].slice(0, 200);
    await setDoc(
      docRef,
      {
        logs: mergedLogs,
        last_updated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Gagal menyimpan log audit ke Firestore:', err);
  }

  return newLog;
}

/**
 * Subscribe to real-time audit logs from Firestore
 */
export function subscribeAuditLogs(callback: (logs: AuditLogItem[]) => void): () => void {
  // Immediately call with cached data
  const cached = getCachedAuditLogs();
  if (cached.length > 0) {
    callback(cached);
  }

  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.logs)) {
            const logs = data.logs as AuditLogItem[];
            try {
              localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
            } catch {
              // Ignore
            }
            callback(logs);
          }
        }
      },
      (error) => {
        console.warn('Gagal berlangganan log audit Firestore:', error);
      }
    );
  } catch (err) {
    console.warn('Error inisialisasi listener audit:', err);
    return () => {};
  }
}

/**
 * Clear audit logs (Admin only)
 */
export async function clearAuditLogs(): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(docRef, { logs: [], last_updated: new Date().toISOString() });
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch (err) {
    console.error('Gagal membersihkan log audit:', err);
    throw err;
  }
}
