import React, {createContext, useState, useEffect } from 'react';
import supabase from '../../Config/supabaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }}) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                console.log(session);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session }} supabase={ supabase }>
            {children}
        </AuthContext.Provider>
    )
}