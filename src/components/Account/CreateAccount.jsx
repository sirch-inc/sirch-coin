import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import supabase from '../../Config/supabaseConfig';


export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      if (passwordsMatch) {
        const { user, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: 'http://localhost:5173/welcome',
            data: {
              name: name
            },
          },
        });
        if (error) {
          // TODO: surface this error...
          throw error;
        }
        if (!user) {
          // TODO: do something with user
        }
        navigate("/verify-account");
      } else if (passwordsMatch === false) {
        // TODO: surface this error
        alert("Passwords do not match.");
      }
    } catch (error) {
      // TODO: surface this error
      console.error("Error signing up:", error.message);
    }
  };

  // verify passwords match
  const handlePasswordConfirmation = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  return (
    <AuthContext.Consumer>
      {({ session }) =>
        !session ? (
          <>
            <h2>Create an Account</h2>
            <p>Already have an account? <a href="/supabase-login">Log in</a> instead.</p>
            <form onSubmit={handleSignUp}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoComplete="username" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" required />
              <input 
                type="password" 
                name="confirm-password" 
                placeholder="Confirm Your Password" 
                autoComplete="current-password" 
                required value={confirmPassword}
                onChange={handlePasswordConfirmation}
                />
                {confirmPassword && (
                  <p style={{ color: passwordsMatch ? "green" : "red" }}>
                    {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
                  </p>
                )}
              <input 
                type="text" 
                name="name" 
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </>
        ) : (
          <div>You&apos;ve successfully logged in as {session.user.email}!</div>
        )
      }
    </AuthContext.Consumer>
  );
}