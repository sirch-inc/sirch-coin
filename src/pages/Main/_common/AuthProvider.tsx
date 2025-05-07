import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import supabase from './supabaseProvider';


export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [authEvent, setAuthEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userInTable, setUserInTable] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [authError, setAuthError] = useState(null);

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
  }, [userInTable]);

  // Manage the user authentication session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((authEvent, session) => {
      setAuthEvent(authEvent);
      
      // TODO: handle the events appropriately
      switch (authEvent) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'USER_UPDATED':
          setSession(session);

          if (session && session.user) {
            setUserId(session.user.id);
            setUserEmail(session.user.email);
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
          setSession(session);
          break;
        case 'TOKEN_REFRESHED':
          setSession(session);
          break;
        default:
          console.error("Auth - Unknown Event", authEvent);
          setAuthError("Auth - Unknown Event");
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
  }, [session, userId]);

  // Get user's current balance
  useEffect(() => {
    refreshUserBalance();
  }, [userInTable, refreshUserBalance]);
  
  return (
    <AuthContext.Provider value={{ authEvent, session, userId, userEmail, userInTable, userBalance, refreshUserBalance, authError }} supabase={ supabase }>
      {children}
    </AuthContext.Provider>
  )
}