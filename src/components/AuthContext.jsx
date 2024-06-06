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

    //Match authenticated user with associated users table
    useEffect(() => {
        const checkUserInTable = async () => {
          if (userId) {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('user_id', userId)
              .single();
    
            if (error) {
              console.error('Error checking user in table:', error);
            } else {
              setUserInTable(data);
              if (data){
                console.log(data.name)
              }
            //   console.log(userInTable.name)
            }
          }
        };
    
        checkUserInTable();
      }, [userId]);
    
      //Get users current balance via user-balances table
      useEffect(() => {
        const getUserBalance = async () => {
          if (userInTable) {
            const { data, error } = await supabase
              .from('user-balances')
              .select('*')
              .eq('user_id', userInTable.user_id)
              .single();
    
            if (error) {
              console.log('Error checking this user\'s balance:', error);
            } else {
              setUserBalance(data);
              if (data) {
                console.log(data.balance); // Log the balance here
              }
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