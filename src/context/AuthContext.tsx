import { createContext, useContext, useState, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AccountStatus, Role, StoredUser, User } from '../types/User';
import { uid } from '../utils/product';

/**
 * LOCAL DEMO ADMIN. Change these before sharing the site and replace this whole
 * file with real server-side authentication when you add a backend.
 */
export const ADMIN_ACCOUNT = { email: 'hrl123@pokeshop.com', password: '12345678' };

const SESSION_KEY = 'pokeshop-session';

export type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  customers: User[];
  login: (email: string, password: string, role: Role, remember: boolean) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void;
  setCustomerStatus: (id: string, status: AccountStatus) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toPublic = (u: StoredUser): User => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone,
  role: u.role, status: u.status, createdAt: u.createdAt,
});

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/** "Remember me" keeps the session in localStorage; otherwise it ends with the browser tab. */
function saveSession(user: User | null, remember: boolean) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  if (user) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<StoredUser[]>('pokeshop-users', []);
  const [user, setUser] = useState<User | null>(loadSession);

  const startSession = (u: User, remember: boolean) => {
    saveSession(u, remember);
    setUser(u);
  };

  const login: AuthContextValue['login'] = (email, password, role, remember) => {
    const mail = email.trim().toLowerCase();
    if (role === 'admin') {
      if (mail !== ADMIN_ACCOUNT.email || password !== ADMIN_ACCOUNT.password) {
        return { ok: false, error: 'Incorrect admin email or password.' };
      }
      startSession(
        { id: 'admin', name: 'Store Admin', email: mail, role: 'admin', status: 'active', createdAt: new Date(0).toISOString() },
        remember,
      );
      return { ok: true };
    }
    const found = users.find((u) => u.email === mail && u.password === password);
    if (!found) return { ok: false, error: 'Incorrect email or password.' };
    if (found.status === 'blocked') return { ok: false, error: 'This account has been blocked. Please contact support.' };
    startSession(toPublic(found), remember);
    return { ok: true };
  };

  const register: AuthContextValue['register'] = (name, email, password) => {
    const mail = email.trim().toLowerCase();
    if (mail === ADMIN_ACCOUNT.email || users.some((u) => u.email === mail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const created: StoredUser = {
      id: uid('usr'), name: name.trim(), email: mail, password,
      role: 'shopper', status: 'active', createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, created]);
    startSession(toPublic(created), true);
    return { ok: true };
  };

  const logout = () => {
    saveSession(null, false);
    setUser(null);
  };

  const updateProfile: AuthContextValue['updateProfile'] = (patch) => {
    if (!user) return;
    const next = { ...user, ...patch };
    const remember = localStorage.getItem(SESSION_KEY) !== null;
    saveSession(next, remember);
    setUser(next);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...patch } : u)));
  };

  const setCustomerStatus = (id: string, status: AccountStatus) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

  return (
    <AuthContext.Provider
      value={{
        user, isAdmin: user?.role === 'admin', customers: users.map(toPublic),
        login, register, logout, updateProfile, setCustomerStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
