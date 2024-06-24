import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import supabase from '../../Config/supabaseConfig';


export default function LoginSupabase() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInError, setSignInError] = useState(false);
    const navigate = useNavigate();
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) {
          setSignInError(true);
          throw error;
        }
  
        // Upon successful login, redir. user to homepage
        navigate("/");
        // TODO: Add login failure notification to user
      } catch (error) {
        console.error("Error logging in:", error.message);
      }
    };
  
    // TODO: Style component
    return (
      <AuthContext.Consumer>
        {({ session }) =>
          !session &&
            !signInError ? (
            <>
            <h2>Log In</h2>
            <p> New users should <a href="/create-account">create an account</a> first.</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="submit">Log In</button>
              <a href="/forgot-password">Forgot Password?</a>
            </form>
            </>
          ) : (
            <div>
              <h2>Log In</h2>
              <p>New users should <a href="/create-account">create an account</a> first.</p>
              <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="submit">Log In</button>
              <a href="/forgot-password">Forgot Password?</a>
            </form>
            <div>
              <p style={{ color: "red" }}>There was an issue with your credentials. Please try logging in again.</p>
            </div>
            </div>
          )
        }
      </AuthContext.Consumer>
    );
  };