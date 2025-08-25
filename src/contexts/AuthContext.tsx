import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

// Extended user type for multi-role support
interface ExtendedUser extends User {
  availableRoles: UserRole[];
}

interface ExtendedAuthState extends Omit<AuthState, 'user'> {
  user: ExtendedUser | null;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<ExtendedAuthState | undefined>(undefined);

// Mock users for demo - some users have multiple roles
const mockUsers: Record<string, ExtendedUser> = {
  'pm@company.com': {
    id: '1',
    name: 'John Smith',
    email: 'pm@company.com',
    role: 'pm',
    department: 'Engineering',
    avatar: 'JS',
    availableRoles: ['pm', 'rmg'] // Multi-role user
  },
  'rmg@company.com': {
    id: '2',
    name: 'Sarah Johnson',
    email: 'rmg@company.com',
    role: 'rmg',
    department: 'HR',
    avatar: 'SJ',
    availableRoles: ['rmg']
  },
  'leadership@company.com': {
    id: '3',
    name: 'Mike Wilson',
    email: 'leadership@company.com',
    role: 'leadership',
    department: 'Executive',
    avatar: 'MW',
    availableRoles: ['leadership', 'pm'] // Multi-role user
  },
  'admin@company.com': {
    id: '4',
    name: 'Lisa Chen',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    avatar: 'LC',
    availableRoles: ['admin', 'rmg', 'pm', 'leadership'] // Admin has all roles
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(
    // Auto-login as PM for demo
    mockUsers['pm@company.com']
  );

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers[email];
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}