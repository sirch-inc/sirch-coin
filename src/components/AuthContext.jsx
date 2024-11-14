import {createContext, useState, useEffect } from 'react';
import supabase from './App/supabaseConfig';


export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userInTable, setUserInTable] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  // Authenticate users
  useEffect(() => {
    // TODO: commented this out for now in favor of using supabase Auth events below...do we need this??
    // supabase.auth.getSession().then(({ data: { session }}) => {
    //   setSession(session);

    //   if (session && session.user) {
    //     setUserId(session.user.id);
    //   }
    // });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // TODO: handle the events appropriately
      switch (event) {
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
          console.error("Auth - Unknown Event", event);
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Match authenticated user with associated users table
  useEffect(() => {
    const checkUserInTable = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          // TODO: surface this error
          alert("Error finding user in table:\n" + error);
        } else {
          setUserInTable(data);
        }
      }
    };

    checkUserInTable();
  }, [userId]);
    
  // Get user's current balance
  useEffect(() => {
    const getUserBalance = async () => {
      if (userInTable) {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', userInTable.user_id)
          .single();

        if (error) {
          // TODO: surface this error...
          alert("Error checking this user's balance:\n" + error);
        } else {
          setUserBalance(data);
        }
      }
    };

    getUserBalance();
  }, [userInTable]);
  
  return (
    <AuthContext.Provider value={{ session, userId, userEmail, userInTable, userBalance }} supabase={ supabase }>
      {children}
    </AuthContext.Provider>
  )
}