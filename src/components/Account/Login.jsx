import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState(false);
  const { session } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setSignInError(true);

        throw error;
      }

      navigate('/');
    } catch (exception) {
      // TODO: Send login failure notification to user

      console.error("Error logging in:", exception.message);
    }
  };
  
  return (
    <>
      {
        !session ? (
          <>
            <h2>Log In</h2>
            <p>New users should <a href="/create-account">create an account</a> first.</p>
            <form onSubmit={handleLogin} autoComplete="off">
              <input
                className="account-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='email'
              />

              <input
                className='account-input'
                type='password'
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='off'
              />

              {signInError &&
              <div>
                <p style={{ color: 'red' }}>There was an issue with your credentials. Please try logging in again.</p>
              </div>
              }

              <button className='account-button' type='submit'>Log In →</button>
              <a href='/forgot-password'>Forgot Password?</a>
              <br/>
            </form>
          </>
        ) : (
          <>
            <h2>You are currently logged in.</h2>
            <br/>
            <h3>Please Log Out first if you want to Login with a different account.</h3>
            <br/>
          </>
        )
      }

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
</>
  );
  }