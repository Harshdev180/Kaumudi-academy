import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../lib/api';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('kaumudi_token');
    const storedEmail = localStorage.getItem('kaumudi_user_email');
    const storedRole = localStorage.getItem('kaumudi_role');
    const storedId = localStorage.getItem('kaumudi_user_id');

    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
      // derive user from stored values and token payload
      const payload = decodeJwt(storedToken) || {};
      setUser({
        id: storedId || payload.id || payload._id || null,
        email: storedEmail,
        role: storedRole || payload.role,
      });
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // store token and derive id/role from it if possible
    setToken(authToken);
    localStorage.setItem('kaumudi_token', authToken);
    setAuthToken(authToken);

    const payload = decodeJwt(authToken) || {};
    const id = payload.id || payload._id || null;
    const role = userData.role || payload.role || 'STUDENT';

    const nextUser = {
      id,
      email: userData.email,
      role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    setUser(nextUser);
    if (nextUser.email) localStorage.setItem('kaumudi_user_email', nextUser.email);
    if (nextUser.id) localStorage.setItem('kaumudi_user_id', nextUser.id);
    localStorage.setItem('kaumudi_role', role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kaumudi_token');
    localStorage.removeItem('kaumudi_user_email');
    localStorage.removeItem('kaumudi_role');
    setAuthToken(null);
    try {
      navigate('/');
    } catch (e) {
      // ignore navigation errors in non-router contexts
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
