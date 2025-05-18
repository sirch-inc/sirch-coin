import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext, AuthContextType, UserTableData } from './AuthContext';
import { Session, AuthChangeEvent, SupabaseClient } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
}

export const AuthProvider = ({ children, supabase }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authEvent, setAuthEvent] = useState<AuthContextType['authEvent']>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInTable, setUserInTable] = useState<UserTableData | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);

  const refreshUserBalance = useCallback(async () => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', userInTable.user_id)
        .single();
  
      if (error) {
        console.error('Error checking this user\'s balance:', error);
        setAuthError(error);
        setUserBalance(null);
      } else {
        setUserBalance(data.balance);
      }
    }
  }, [userInTable, supabase]);

  // Manage the user authentication session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setAuthEvent(event);
      
        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
          case 'USER_UPDATED':
            setSession(session);

            if (session?.user) {
              setUserId(session.user.id);
              setUserEmail(session.user.email ?? null);
            }
            break;
          case 'SIGNED_OUT':
            setSession(null);
            setUserId(null);
            setUserEmail(null);
            setUserInTable(null);
            setUserBalance(null);
            setAuthError(null);

            // clear local and session storage
            [
              window.localStorage,
              window.sessionStorage,
            ].forEach((storage) => {
              Object.entries(storage)
                .forEach(([key]) => {
                  storage.removeItem(key)
                })
            });
            break;
          case 'PASSWORD_RECOVERY':
          case 'TOKEN_REFRESHED':
            setSession(session);
            break;
          default:
            console.error("Auth - Unknown Event", event);
            setAuthError(new Error("Auth - Unknown Event"));
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Fetch the user's profile
  useEffect(() => {
    const fetchUser = async () => {
      if (session && userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error("Error finding user in table:\n" + error);
          setAuthError(error);
        } else {
          setUserInTable(data);
        }
      } else {
        setUserInTable(null);
      }
    };

    fetchUser();
  }, [session, userId, supabase]);

  // Get user's current balance
  useEffect(() => {
    refreshUserBalance();
  }, [userInTable, refreshUserBalance]);
  
  const contextValue: AuthContextType = {
    authEvent,
    session,
    userId,
    userEmail,
    userInTable,
    userBalance,
    refreshUserBalance,
    authError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}