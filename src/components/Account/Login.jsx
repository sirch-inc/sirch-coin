import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.code === 'invalid_credentials') {
          setSignInError(true);
          return;
        } else {
          throw new Error(error);
        }
      }

      if (!user) {
        throw new Error("No user was returned.");
      }

      navigate('/');
    } catch (exception) {
      console.error(exception);

      navigate('/error', { replace: true });
    }
  };
  
  return (
    <AuthContext.Consumer>
      {({ session }) =>
        !session &&
          !signInError ? (
          <>
          <h2>Log In</h2>
          <p> New users should <a href='/create-account'>create an account</a> first.</p>
          <form onSubmit={handleLogin}>
            <input
              className='account-input'
              type='email'
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='username'
            />
            <input
              className='account-input'
              type='password'
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
            <button className='account-button' type='submit'>Log In →</button>
            <a href='/forgot-password'>Forgot Password?</a>
          </form>
          </>
        ) : (
          <div>
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
            <button className='account-button' type='submit'>Log In →</button>
            <a href='/forgot-password'>Forgot Password?</a>
          </form>
          <div>
            <p style={{ color: 'red' }}>There was an issue with your credentials. Please try logging in again.</p>
          </div>
          </div>
        )
      }
    </AuthContext.Consumer>
    );
  }