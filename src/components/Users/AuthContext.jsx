import React, {createContext, useState, useEffect } from 'react';
import supabase from '../../Config/supabaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userID, setUserId] = useState(null);

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

    return (
        <AuthContext.Provider value={{ session, userID }} supabase={ supabase }>
            {children}
        </AuthContext.Provider>
    )
}