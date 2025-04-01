import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiLogin({ email, password });
      
      if (response.status === 'success') {
        localStorage.setItem('auth_token', response.auth_token);
        localStorage.setItem('user_data', JSON.stringify(response.data));
        setUser(response.data);
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRegister(userData);
      
      if (response.status === 'success') {
        localStorage.setItem('auth_token', response.auth_token);
        localStorage.setItem('user_data', JSON.stringify(response.data));
        setUser(response.data);
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Try to logout via API, but don't wait for success
      // This prevents the 401 error from blocking the logout process
      apiLogout().catch(err => {
        console.warn('Server logout failed, cleaning up locally:', err);
      });
    } finally {
      // Always clear local storage and state regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      navigate('/login');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
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
