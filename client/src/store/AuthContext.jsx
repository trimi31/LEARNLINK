import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await fetchCurrentUser();
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (fullName, email, password, role) => {
    const response = await authApi.register({ fullName, email, password, role });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    return await fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Computed values - always derived from current user state
  const isAuthenticated = !!user;
  const isStudent = user?.role === 'STUDENT';
  const isProfessor = user?.role === 'PROFESSOR';
  const studentId = user?.studentProfile?.id || null;
  const professorId = user?.professorProfile?.id || null;

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    isAuthenticated,
    isStudent,
    isProfessor,
    studentId,
    professorId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
