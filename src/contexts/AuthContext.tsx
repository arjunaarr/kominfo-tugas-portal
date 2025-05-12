
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState, User } from '@/types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    universitas: 'Universitas Indonesia',
    bidang: 'IT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    universitas: 'Institut Teknologi Bandung',
    bidang: 'Data',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setState({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
          setState({ ...initialAuthState, isLoading: false });
        }
      } else {
        setState({ ...initialAuthState, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a safe copy without password
      const safeUser = { ...user };
      delete safeUser.password;
      
      localStorage.setItem('user', JSON.stringify(safeUser));
      setState({ user: safeUser, isAuthenticated: true, isLoading: false });
      
      // Record login
      const loginRecord = {
        id: Date.now().toString(),
        userId: user.id,
        loginTime: new Date().toISOString()
      };
      
      // Save login records (for demo)
      const logins = JSON.parse(localStorage.getItem('logins') || '[]');
      logins.push(loginRecord);
      localStorage.setItem('logins', JSON.stringify(logins));
      
      toast.success('Login successful!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData, updatedAt: new Date().toISOString() };
      setState({ ...state, user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in mock users (for demo)
      const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      }
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
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
