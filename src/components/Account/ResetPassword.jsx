import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import supabase from '../App/supabaseProvider'


export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [passwordRecoverySession, setPasswordRecoverySession] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();

  // verify the PASSWORD_RECOVERY event is present and set session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoverySession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  async function submitPassword(e) {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // If the user has arrived at this page from their update password link, they should have a passwordRecoverySession
      if (passwordRecoverySession) {
        // TODO: consider using supabase.auth.reauthenticate() and/or supabase.auth.resend() here...
        const { data: user, error } = await supabase.auth.updateUser(
          { password: newPassword },
          { session: passwordRecoverySession }
        );
        
        if (error) {
          throw new Error(error);
        }

        if (!user) {
          throw new Error("No user updated.");
        }
  
        // TODO: surface this success message appropriately
        alert('Password updated successfully!');
      } else {
        // TODO: surface this error appropriately
        alert("Something's not right...have you arrived at this page by clicking on the link in your email? You may need to request another password reset email via the Login page before being able to successfully update your password.");
      }

      navigate('/');
    } catch (exception) {
      console.error(exception);

      navigate('/error', { replace: true });
    }
  }

  // verify passwords match
  const handlePasswordConfirmation = (e) =>{
    const value = e.target.value;

    setConfirmPassword(value);
    setPasswordsMatch(value === newPassword)
  }

  return(
    <>
      <ToastContainer
        position = 'top-right'
        autoClose = {false}
        newestOnTop = {false}
        closeOnClick
        draggable
        theme = 'colored'
      />

      <h1>Enter a New Password:</h1>
      <p>Choose a new password for your Sirch Coins account below:</p>

      <form onSubmit={submitPassword}>
        <input 
          type='password'
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <input 
          type='password' 
          name='confirm-password' 
          placeholder="Confirm New Password" 
          autoComplete='current-password' 
          required value={confirmPassword}
          onChange={handlePasswordConfirmation}
        />
        {confirmPassword && (
          <p style={{ color: passwordsMatch ? 'green' : 'red' }}>
            {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
          </p>
        )}
        <button>Change Password</button>
      </form>
    </>
  )
}