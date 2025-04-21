import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import pb, { isUserValid, getCurrentUser, login as pbLogin, logout as pbLogout } from '@/lib/pocketbase';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAdminPassword: (password: string) => boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isUserValid()) {
          const pbUser = getCurrentUser();
          if (pbUser) {
            // Convert PocketBase user to our User type
            setUser({
              id: Number(pbUser.id),
              username: pbUser.username,
              password: '',
              fullName: pbUser.name || pbUser.username,
              email: pbUser.email,
              avatar: pbUser.avatar ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pbUser.collectionId}/${pbUser.id}/${pbUser.avatar}` : null,
              role: pbUser.role || 'user'
            });
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const authData = await pbLogin(username, password);
      const pbUser = authData.record;
      
      setUser({
        id: Number(pbUser.id),
        username: pbUser.username,
        password: '',
        fullName: pbUser.name || pbUser.username,
        email: pbUser.email,
        avatar: pbUser.avatar ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pbUser.collectionId}/${pbUser.id}/${pbUser.avatar}` : null,
        role: pbUser.role || 'user'
      });
      
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${pbUser.username}!`,
      });
      
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      pbLogout();
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Admin password check
  const checkAdminPassword = (password: string) => {
    const ADMIN_PASSWORD = 'GENZCLANX';  // In production, this should be an env variable
    return password === ADMIN_PASSWORD;
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout, 
        checkAdminPassword,
        isAuthenticated
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
