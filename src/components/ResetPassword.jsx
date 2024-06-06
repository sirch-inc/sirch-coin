import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../Config/supabaseConfig'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [passwordRecoverySession, setPasswordRecoverySession] = useState(null)
    const navigate = useNavigate();

    // Checks to ensure that the PASSWORD_RECOVERY event is present and sets session.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            setPasswordRecoverySession(session)
          }
        });
    
        return () => {
          subscription.unsubscribe();
        };
      }, []);
    
      async function submitPassword(e) {
        e.preventDefault();
    
        // If the user has arrived at this page from their update password link, they will have a passwordRecoverySession
        if (passwordRecoverySession){
            const { data, error } = await supabase.auth.updateUser(
                { password: newPassword },
                { session: passwordRecoverySession }
            );
            
            if (error) {
                //TODO: Change from alert to error messaging on the frontend.
              alert('There was an error updating your password.');
            } else {
                //TODO: Change from alert to a success message once redirected to the homepage. 
              alert('Password updated successfully!');
              navigate('/');
            }
        } else {
            //TODO: Change from alert to error messaging on the frontend.
            alert("Something's not right... have you arrived at this page by clicking on the link in your email? You may need to request another password reset via the Login page before being able to successfully update your password.")
        }
      }

    return(
        <>
            <h1>Enter a New Password:</h1>
            <p> Choose a new password for your SirchCoin account by entering it below:</p>

            <form onSubmit={submitPassword}>
                <input 
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="current-password"/>
                <button>Change Password</button>
            </form>
        </>
    )
}