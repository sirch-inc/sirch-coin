import {createContext, useState, useEffect } from 'react';
import supabase from './App/supabaseConfig';


export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userInTable, setUserInTable] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  // Authenticate users
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      setSession(session);

      if (session && session.user) {
        setUserId(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session && session.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
          setUserInTable(null);
        }
      }
    );

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
          alert('Error checking user in table:', error);
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
          .from('balances')
          .select('*')
          .eq('user_id', userInTable.user_id)
          .single();

        if (error) {
          // TODO: surface this error...
          alert("Error checking this user's balance:", error);
        } else {
          setUserBalance(data);
        }
      }
    };

    getUserBalance();
  }, [userInTable]);
  

  return (
    <AuthContext.Provider value={{ session, userId, userInTable, userBalance }} supabase={ supabase }>
      {children}
    </AuthContext.Provider>
  )
}