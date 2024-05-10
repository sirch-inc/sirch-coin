import React, { useState, useEffect } from "react";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { AuthContext } from "./AuthContext";

const LoginSupabase = ({supabase}) => {

    console.log(supabase)
    return (
        <AuthContext.Consumer>
        {({ session }) =>
            !session ? (
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
            ) : (
            <div>You've successfully logged in as {session.user.email}!</div>
            )
        }
        </AuthContext.Consumer>
    )
    }

export default LoginSupabase