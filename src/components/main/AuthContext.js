import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
    role: localStorage.getItem('role') || '',
    username: localStorage.getItem('username') || '',
    userId: localStorage.getItem('userId') || '',
  });

  const login = ({ role, username, userId }) => {
    setAuth({ isLoggedIn: true, role, username, userId });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: '', username: '', userId: '' });
  };

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      const userId = localStorage.getItem('userId');

      setAuth({
        isLoggedIn: !!token,
        role: role || '',
        username: username || '',
        userId: userId || '',
      });
    };

    const handleStorageChange = () => syncAuthState();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
