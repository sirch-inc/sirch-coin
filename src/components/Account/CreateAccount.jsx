import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseConfig';


export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [isEmailPrivate, setIsEmailPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isNamePrivate, setIsNamePrivate] = useState(false);
  const [userHandle, setUserHandle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    handleSuggestNewHandle();
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    
    try {
      if (!passwordsMatch) {
        // TODO: surface this error
        alert("Passwords do not match.");
        return;
      }

      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            full_name: firstName + ' ' + lastName,
            first_name: firstName,
            last_name: lastName,
            is_name_private: isNamePrivate,
            user_handle: userHandle,
            is_email_private: isEmailPrivate
          },
        },
      });

      if (error) {
        // TODO: surface this error...
        throw error;
      }

      if (!user) {
        // TODO: do something with user
      }

      navigate('/verify-account');
    } catch (exception) {
      // TODO: surface this error
      alert("Error signing up:\n" + exception.message);
    }
  };

  // verify passwords match
  const handlePasswordConfirmation = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  // refresh user handle
  const handleSuggestNewHandle = async () => {
    setUserHandle('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-valid-user-handles', {
        body: {
          handleCount: 1
        }
      });
    
      if (error) {
        // TODO: surface this error...
        throw error;
      }

      setUserHandle(data.handles[0]);
    } catch (exception) {
      // TODO: surface this error
      alert("Error generating new handle(s):\n" + exception.message);
    }
  };
  
  return (
    <AuthContext.Consumer>
      {({ session }) =>
        !session ? (
          <>
            <h2>Create Account</h2>
            <p>Already have an account? <a href='/login'>Log in</a> instead.</p>
            <br></br>

            <form onSubmit={handleSignUp} autoComplete='off'>
              <div className='account-privacy-statement'>
                <h3>Your Account & Privacy</h3>
                <p>
                  Sirch and the Sirch Coins product and services take your privacy very seriously.
                  We believe your data (email address, name, photo, activity, and social connections) belong to <i>you</i>, and
                  that <i>you</i> should decide how and when to share them or make them accessible to others.
                </p>
                <p>
                  That said, we also encourage our users to share their profile with others to create a networked community
                  and to make it easier for people on our platforms to find and connect with you.
                </p>
                <p>
                  The choice is yours; you can adjust your Privacy settings at any time in your Account Profile.
                </p>
              </div>

              <br></br>

              <div className='account-row'>
                <input 
                  className='account-input'
                  type='email' 
                  id='email' 
                  name='email' 
                  placeholder="Email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  autoComplete='email'
                  required
                />

                <div id='is-email-private'>
                  <input
                    className='account-input'
                    type='checkbox'
                    id='is-email-private-checkbox'
                    name='is-email-private'
                    value={isEmailPrivate}
                    onChange={(e) => setIsEmailPrivate(e.target.checked)}
                  />
                  <label
                    htmlFor='is-email-private'
                    id='is-email-private-label'
                  >
                    Keep my email PRIVATE<br />among other users in Sirch services
                  </label>
                </div>
              </div>

              <div className='account-row'>
                <input
                  className='account-input'
                  type='password'
                  id='password'
                  name='password'
                  placeholder="Password"
                  value = {password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete='off'
                  required
                />
                <input
                  className='account-input'
                  type='password'
                  name='confirm-password'
                  id='confirm-password'
                  placeholder="Confirm Your Password"
                  value={confirmPassword}
                  onChange={handlePasswordConfirmation}
                  autoComplete='off'
                  required
                />
              </div>
              {confirmPassword && (
                <p style={{ color: passwordsMatch ? 'green' : 'red' }}>
                  {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
                </p>
              )}

              <div className='account-row'>
                <input 
                  className='account-input'
                  type='text'
                  id='first-name'
                  name='first-name'
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className='account-input'
                  type='text'
                  id='last-name'
                  name='last-name'
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <div id='is-name-private'>
                  <input
                    className='account-input'
                    type='checkbox'
                    id='is-name-private-checkbox'
                    name='is-name-private'
                    value={isNamePrivate}
                    onChange={(e) => setIsNamePrivate(e.target.checked)}
                  />
                  <label
                    htmlFor='is-name-private'
                    id='is-name-private-label'
                  >
                    Keep my name PRIVATE<br />among other users in Sirch services
                  </label>
                </div>
              </div>

              <div id='account-user-handle-row'>
                <div width='30%'>
                  <p>
                  Your Sirch account includes a unique, random, two-word phrase to help other users find you
                  easily and to help keep your Name and Email private if you choose not to share them.
                  </p>
                  <p>
                  You may change this phrase at any time in your Account Profile.
                  </p>
                </div>
                <input
                  className='account-input'
                  type='text'
                  id='user-handle'
                  name='user-handle'
                  placeholder="Loading..."
                  value={userHandle}
                  readOnly
                  required
                />
                <button
                  className='account-button'
                  type='button'
                  onClick={handleSuggestNewHandle}
                > Pick Another ↺ </button>
              </div>
              <br></br>
              <button className='account-button' type='submit'> Sign Up → </button>
            </form>
          </>
        ) : (
          <div>You&apos;ve successfully logged in as {session.user.email}!</div>
        )
      }
    </AuthContext.Consumer>
  );
}