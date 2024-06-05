import { useState } from 'react'
import supabase from "../Config/supabaseConfig"

export default function ResetPassword() {

    const [userEmail, setUserEmail] = useState("")
    
    async function requestReset(){
        const {data, error} = await supabase.auth.resetPasswordForEmail(userEmail, {
            redirectTo: '/update-password',
          })

          if (error){
            throw error;
          } else {
            console.log(data)
          }
    }

    return(
        <>
            <h1>Reset Password</h1>
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
                <button>Reset Password</button>
            </form>
        </>
    )
}