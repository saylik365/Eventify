import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [globalRole, setGlobalRole] = useState(null);
  const [ownerOf, setOwnerOf] = useState([]);
  const [cohostOf, setCohostOf] = useState([]);
  const [guestOf, setGuestOf] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser(payload);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // On token change, verify session with /auth/me and fetch roles
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (!res.data || !res.data.role) throw new Error();
        setUser(res.data);
        setGlobalRole(res.data.role);
        setOwnerOf(res.data.ownerOf || []);
        setCohostOf(res.data.cohostOf || []);
        setGuestOf(res.data.guestOf || []);
      } catch {
        toast.error('Session expired or unauthorized. Please log in again.');
        logout();
      }
      setLoading(false);
    };
    verifySession();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setGlobalRole(null);
    setOwnerOf([]);
    setCohostOf([]);
    setGuestOf([]);
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, globalRole, ownerOf, cohostOf, guestOf, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
