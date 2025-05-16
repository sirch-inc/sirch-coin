import { createContext } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface UserTableData {
  user_id: string;
  email: string;
  full_name?: string;
  user_handle?: string;
  is_email_private: boolean;
  is_name_private: boolean;
  created_at: string;
}

export interface AuthContextType {
  authEvent: AuthChangeEvent | null;
  session: Session | null;
  userId: string | null;
  userEmail: string | null;
  userInTable: UserTableData | null;
  userBalance: number | null;
  refreshUserBalance: () => Promise<void>;
  authError: Error | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);