import React, {createContext, useState, useEffect } from 'react';
import supabase from '../Config/supabaseConfig';

export const AuthContext = createContext();

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
                if (session && session.user){
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
              // TODO: handle this error
              alert('Error checking user in table:', error);
            } else {
              setUserInTable(data);
            //   console.log(userInTable.name)
            }
          }
        };
    
        checkUserInTable();
      }, [userId]);
    
      // Get users current balance via user-balances table
      useEffect(() => {
        const getUserBalance = async () => {
          if (userInTable) {
            const { data, error } = await supabase
              .from('user-balances')
              .select('*')
              .eq('user_id', userInTable.user_id)
              .single();
    
            if (error) {
              alert('Error checking this user\'s balance:', error);
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