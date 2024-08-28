import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import supabase from '../App/supabaseConfig';


export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isNamePrivate, setIsNamePrivate] = useState(false);
  const [userHandle, setUserHandle] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: fetch the user's balance when the component mounts
    handleSuggestNewHandle();//(userInTable);
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    
    try {
      if (!passwordsMatch) {
        // TODO: surface this error
        alert("Passwords do not match.");
        return;
      }

      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            full_name: firstName + " " + lastName,
            first_name: firstName,
            last_name: lastName,
            is_name_private: isNamePrivate,
            user_handle: userHandle
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
    } catch (exception) {
      // TODO: surface this error
      alert("Error signing up:", exception);
    }
  };

  // verify passwords match
  const handlePasswordConfirmation = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  // refresh user handle
  const handleSuggestNewHandle = () => {
    // TODO: invoke backend service
    setUserHandle("refreshed");
  };
  
  return (
    <AuthContext.Consumer>
      {({ session }) =>
        !session ? (
          <>
            <h2>Create an Account</h2>
            <p>Already have an account? <a href="/login">Log in</a> instead.</p>
            <br></br>
            <h3>Your Account & Privacy</h3>
            <p>
              Sirch and the Sirch Coins product and services take your privacy very seriously.
              We believe your data (email address, name, photo, activity, and social connections) belong to <i>you</i>, and
              that <i>you</i> should decide how and when to share them or make them accessible to others.
            </p>
            <p>
              That said, we also encourage our users to share their profile with others to create a networked community
              and to make it easier for people on our platforms to find and connect with you.
            </p>
            <p>
              The choice is yours; you can adjust your Privacy settings at any time in your Account Profile.
            </p>

            <form onSubmit={handleSignUp}>
              <input 
                className="account-input"
                type="email" 
                id="email" 
                name="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="username"
                required
              />
              <input
                className="account-input"
                type="password" 
                id="password" 
                name="password" 
                placeholder="Password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <input
                className="account-input"
                type="password" 
                name="confirm-password" 
                id="confirm-password" 
                placeholder="Confirm Your Password" 
                value={confirmPassword}
                onChange={handlePasswordConfirmation}
                autoComplete="off" 
                required
              />
              {confirmPassword && (
                <p style={{ color: passwordsMatch ? "green" : "red" }}>
                  {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
                </p>
              )}
              <input 
                className="account-input"
                type="text"
                id="first-name"
                name="first-name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className="account-input"
                type="text"
                id="last-name"
                name="last-name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                className="account-input"
                type="checkbox"
                id="is-name-private"
                name="is-name-private"
                value={isNamePrivate}
                onChange={(e) => setIsNamePrivate(e.target.checked)}
              />
              <label htmlFor="is-name-private">Keep my name PRIVATE among other users in Sirch Coins</label>
              <input
                className="account-input"
                type="text"
                id="user-handle"
                name="user-handle"
                placeholder="Loading..."
                value={userHandle}
                // onChange={(e) => setUserHandle(e.target.value)}
                readOnly
                required
              />
              <button
                className="account-button"
                type="button"
                onClick={handleSuggestNewHandle}
              >
                Suggest New Handle
              </button>
              <br></br>
              <button className="account-button" type="submit">Sign Up →</button>
            </form>
          </>
        ) : (
          <div>You&apos;ve successfully logged in as {session.user.email}!</div>
        )
      }
    </AuthContext.Consumer>
  );
}