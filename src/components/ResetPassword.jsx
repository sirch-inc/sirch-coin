import { useState } from 'react'

export default function ResetPassword() {

    const [userEmail, setUserEmail] = useState(null)

    return(
        <>
            <h1>Reset Password</h1>
            <p>Enter the email you used to sign up for Sirch Coin:</p>

            <form className="reset-password">
                <input 
                    type="email"
                    placeholder="Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
            </form>
        </>
    )
}