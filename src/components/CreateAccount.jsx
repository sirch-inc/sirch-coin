import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from '../Config/supabaseConfig';

export default function CreateAccount() {
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
      event.preventDefault();
      const { email, password, name } = event.target.elements;
  
      try {
        const { user, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
          options: {
            data: {
              name: name.value,
            },
          },
        })
  
        if (error) {
          throw error;
        }

        navigate("/verify-account");
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    };
  
    // TODO: Style component
    return (
      <AuthContext.Consumer>
        {({ session }) =>
          !session ? (
            <>
            <h2> Create an Account</h2>
            <p> Already have an account? <a href="/supabase-login">Log in</a> instead.</p>
            <form onSubmit={handleSignUp}>
              <input type="email" name="email" placeholder="Email" required autoComplete="username" />
              <input type="password" name="password" placeholder="Password" autoComplete="current-password" required />
              <input type="text" name="name" placeholder="First Name" required />
              <button type="submit">Sign Up</button>
            </form>
            </>
          ) : (
            <div>You've successfully logged in as {session.user.email}!</div>
          )
        }
      </AuthContext.Consumer>
    );
  };