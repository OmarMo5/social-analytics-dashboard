import { createContext, useContext, useState } from 'react';
import USERS from '../config/users';

const AuthContext = createContext();
const STORAGE_KEY = 'asc_dashboard_auth_user';

function readStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = USERS.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return { success: false, field: 'email', message: 'البريد الإلكتروني غير مسجل في النظام' };
    }
    if (found.password !== password) {
      return { success: false, field: 'password', message: 'كلمة المرور غير صحيحة' };
    }

    const sessionUser = { name: found.name, email: found.email };
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
