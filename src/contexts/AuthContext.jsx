import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  // Verifica si el token es válido (igual que en bskmt.com)
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  // Login adaptado para la consola
  const login = async (credentials) => {
    try {
      const response = await axios.post('https://api.bskmt.com/auth/login', credentials);
      
      // Asegúrate que estos nombres coincidan con la respuesta de tu API
      const { accessToken, refreshToken, data } = response.data;
      
      localStorage.setItem('bskmt_accessToken', accessToken);
      localStorage.setItem('bskmt_refreshToken', refreshToken);
      
      // Obtener datos completos del usuario (adaptado para la consola)
      const userResponse = await axios.get('https://api.bskmt.com/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      setUser(userResponse.data.user);
      
      // Redirección FORZADA al dashboard
      window.location.href = '/dashboard'; // Esto evita problemas con React Router
      
      return userResponse.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout (similar al original)
  const logout = () => {
    localStorage.removeItem('bskmt_accessToken');
    localStorage.removeItem('bskmt_refreshToken');
    setUser(null);
    window.location.href = '/login'; // Redirección forzada
  };

  // Verificación inicial de autenticación
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('bskmt_accessToken');
      
      if (token && isTokenValid(token)) {
        try {
          const response = await axios.get('https://api.bskmt.com/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth verification error:', error);
          logout();
        }
      }
      setLoadingAuth(false);
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout }}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};