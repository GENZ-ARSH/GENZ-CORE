import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // For now, use a mock user since we don't have a real authentication system
  const mockUser: User = {
    id: 1,
    username: 'aryan.sharma',
    password: '',
    fullName: 'Aryan Sharma',
    email: 'aryan@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    role: 'admin'
  };
  
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, we would fetch the user from the server
  /*
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/me'],
    staleTime: Infinity,
  });
  */

  const logout = async () => {
    try {
      setIsLoading(true);
      // In a real app, we would call the logout API
      // await apiRequest('POST', '/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, logout }}>
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
