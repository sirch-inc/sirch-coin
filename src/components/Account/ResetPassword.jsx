import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../App/supabaseProvider'


// TODO: Can we use this same component for currently logged-in users (maybe with
// TODO: reauthentication using the "current password") as well as email-triggered password
// TODO: reset flows?
// TODO: ...would want a "Back" button (and "current password field") if rendered in-session.
// TODO: ...and we would then remove the password fields from "UpdateUser".
// TODO: Send an email informing the user of the password change.
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
      // TODO: surface this error appropriately
      alert("Passwords must match")
    }

    // If the user has arrived at this page from their update password link, they should have a passwordRecoverySession
    if (passwordRecoverySession) {
      const { data, error } = await supabase.auth.updateUser(
        { password: newPassword },
        { session: passwordRecoverySession }
      );
      
      if (error) {
        // TODO: surface this error appropriately
        alert('There was an error updating your password:\n' + error);
        console.log("Data", data);
      } else {
        // TODO: surface this success message appropriately
        alert('Password updated successfully!');
        navigate('/');
      }
    } else {
      // TODO: surface this error appropriately
      alert("Something's not right... have you arrived at this page by clicking on the link in your email? You may need to request another password reset via the Login page before being able to successfully update your password.")
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
      <h1>Reset Password</h1>
      <p>Enter a new password for your Sirch Coins account below.</p>

      <form onSubmit={submitPassword}>
        <input
          className='account-input'
          type='password'
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete='off'
          required
        />

        <input
          className='account-input'
          type='password'
          placeholder="Confirm New Password"
          value={confirmPassword}
          name='confirm-password'
          onChange={handlePasswordConfirmation}
          autoComplete='off'
          required
        />

        {confirmPassword && (
          <p style={{ color: passwordsMatch ? 'green' : 'red' }}>
            {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
          </p>
        )}

        <br/>

        <button className='account-button' type='submit'> Change Password → </button>
      </form>
    </>
  )
}