import React, {createContext, useState, useEffect } from 'react';
import supabase from '../../Config/supabaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userInTable, setUserInTable] = useState(null);

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
                    console.log(session.user.id);
                    console.log(session)
                } else {
                    setUserId(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    
    }, []);

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
              console.log(userInTable)
            }
          }
        };
    
        checkUserInTable();
      }, [userId]);
    
    

    return (
        <AuthContext.Provider value={{ session, userId, userInTable }} supabase={ supabase }>
            {children}
        </AuthContext.Provider>
    )
}