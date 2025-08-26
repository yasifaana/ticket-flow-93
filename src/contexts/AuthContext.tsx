import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  isNotification: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:8080/api";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('authToken');
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch current user
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/me`);
      setUser(response.data);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });

      const { token, profile } = response.data;

      console.log(response.data);
      
      // Store token
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(profile);
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || "Sign in failed";
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
        name
      });

      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to TicketFlow!",
      });
      
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || "Sign up failed";
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => prev ? {...prev, ...updates} : prev);
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}