import { useState } from 'react'
import supabase from "../../Config/supabaseConfig"


export default function ForgotPassword() {
    const [userEmail, setUserEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState(null);
    
    async function requestReset(e){
        e.preventDefault();

        // Use supabase resetPasswordForEmail() to trigger a password reset email event and redirect to the update password page
        try {
            const {data, error} = await supabase.auth.resetPasswordForEmail(userEmail, {
                redirectTo: `${window.location.origin}/reset-password`, })

            if (error) {
              // TODO: surface or handle error
                throw error;
            } else {
                setResetSent(true);
            }
        }

        catch (error) {
            // TODO: surface or handle error...
            console.error('Error: ', error.message);
            setError(error.message);
        }
    }

    return (
        <>
          <h1>Reset Password</h1>
          {/* If the reset hasn't been sent, display the form. Otherwise show "sent" messaging.*/}
          {!resetSent ? (
            <>
              <p>Enter the email you used to sign up for Sirch Coin:</p>
              <form className="reset-password" onSubmit={requestReset}>
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
                <button type="submit">Send Reset Email</button>
              </form>
              {error && <p className="error">{error}</p>}
            </>
          ) : (
            <p>If the email address {userEmail} has a Sirch Coins account, we've emailed you a link to reset your password. Please check your email inbox.</p>
          )}
        </>
      );
}