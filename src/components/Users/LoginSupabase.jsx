import React, { useState, useEffect } from "react";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const LoginSupabase = ({supabase}) => {

    console.log(supabase)
    const [session, setSession] = useState(null)
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
  
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          console.log(session)
        })
  
        return () => subscription.unsubscribe()
      }, [])
  
      if (!session) {
        return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
      }
      else {
        return (<div>You've successfully logged in as {session.user.email}!</div>)
      }
    }

export default LoginSupabase