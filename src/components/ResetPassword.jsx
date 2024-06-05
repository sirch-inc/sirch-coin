import { useState } from 'react'
import supabase from "../Config/supabaseConfig"

export default function ResetPassword() {

    const [userEmail, setUserEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState(null);
    
    async function requestReset(e){
        e.preventDefault();

        try {
            const {data, error} = await supabase.auth.resetPasswordForEmail(userEmail)

            if (error){
                throw error;
            } else {
                console.log(data)
                setResetSent(true);
            }
        }

        catch (error) {
            console.error('Error: ', error.message);
            setError(error.message);
        }
    }

    return (
        <>
          <h1>Reset Password</h1>
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
                <button type="submit">Reset Password</button>
              </form>
              {error && <p className="error">{error}</p>}
            </>
          ) : (
            <p>We've sent a link to that email address to reset your password. Please check your inbox.</p>
          )}
        </>
      );
}