import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { ToastNotification, toast } from '../../../pages/Main/App/ToastNotification';
import supabase from '../../../pages/Main/App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (isAuthApiError(error)) {
          toast.error(error.message);
          setPassword('');
          return;
        }
        
        throw new Error(error);
      }

      if (!user) {
        throw new Error("No user was returned.");
      }

      navigate('/');
    } catch (exception) {
      console.error("An exception occurred:", exception.message);
      navigate('/error', { replace: true });
    }
  };
  
  return (
    <div className="login-container">
      <ToastNotification />

      {!session ? (
        <>
          <h2>Log In</h2>
          <p>New users should <a href="/create-account">create an account</a> first.</p>
          <form className="login-form" onSubmit={handleLogin} autoComplete="off">
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
              id='password'
              name='password'
              type='password'
              placeholder="Password"
              minLength='6'
              maxLength='64'      
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='off'
              required
            />

            <button className='account-button' type='submit'>Log In →</button>
            <a href='/reset-password-request'>Forgot Password?</a>
          </form>
        </>
      ) : (
        <>
          <h2>You are currently logged in.</h2>
          <br/>
          <h3>Please Log Out first if you want to Login with a different account.</h3>
        </>
      )}

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </div>
  );
}