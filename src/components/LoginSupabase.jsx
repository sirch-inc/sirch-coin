import React from "react";
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { AuthContext } from "./AuthContext";
import supabase from '../Config/supabaseConfig'


const LoginSupabase = () => {

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