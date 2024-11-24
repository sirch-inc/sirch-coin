import { useState, useContext } from 'react'
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseConfig';
import { isAuthApiError } from '@supabase/supabase-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UpdateAccount() {
  const { userInTable, userEmail } = useContext(AuthContext);
  const [email, setEmail] = useState(userEmail || '');
  const [isEmailPrivate, setIsEmailPrivate] = useState(userInTable?.is_email_private);
  const [hasEmailChanged, setHasEmailChanged] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [firstName, setFirstName] = useState(userInTable?.first_name);
  const [lastName, setLastName] = useState(userInTable?.last_name);
  const [isNamePrivate, setIsNamePrivate] = useState(userInTable?.is_name_private);
  const [userHandle, setUserHandle] = useState(userInTable?.user_handle);

  const handleUpdate = async (event) => {
    event.preventDefault();
    
    try {
      if (!passwordsMatch) {
        // TODO: surface this error
        alert("Passwords do not match.");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        email,
        password: password !== '' ? password : null,
        data: {
          full_name: firstName + ' ' + lastName,
          first_name: firstName,
          last_name: lastName,
          is_name_private: isNamePrivate,
          user_handle: userHandle,
          is_email_private: isEmailPrivate
        },
        options: {
          // TODO: change this redirect to something else???
          emailRedirectTo: `${window.location.origin}/welcome`,
        }
      });

      if (error) {
        if (isAuthApiError(error)) {
          toast.error("There was an error updating your user account. Please try again later or contact technical support.");
        }
        return;
      }

      toast.success("Account updated!");

      // reset form
      setPassword('');
      setConfirmPassword('');
      
      if (hasEmailChanged) {
        toast.success("A verification email was sent to your new email address.");
      }
    } catch (exception) {
      toast.error(exception.message, {
        position: 'top-right',
      });
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setHasEmailChanged(newEmail !== userEmail);
  }

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
        session ? (
          <>
            <ToastContainer
              position="top-right"
              autoClose={false}
              newestOnTop={false}
              closeOnClick
              draggable
              theme="colored"
            />

            <h2>Update Account</h2>

            <form onSubmit={handleUpdate} autoComplete="off">
              <div className="account-row">
                <input 
                  className="account-input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email} 
                  onChange={ handleEmailChange }
                  autoComplete="email"
                />
                <div id="is-email-private">
                  <input
                    className="account-input"
                    type="checkbox"
                    id="is-email-private-checkbox"
                    name="is-email-private"
                    value={isEmailPrivate}
                    checked={isEmailPrivate}
                    onChange={(e) => setIsEmailPrivate(e.target.checked)}
                  />
                  <label
                    htmlFor="is-email-private"
                    id="is-email-private-label"
                  >
                    Keep my email PRIVATE<br />among other users in Sirch services
                  </label>
                </div>
              </div>

              {hasEmailChanged &&
                <p style={{color: "green"}}>
                  Note: Changes to your email address will require email reverification.
                </p>
              }

              <div className="account-row">
                <input
                  className="account-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="New Password"
                  value = {password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <input
                  className="account-input"
                  type="password" 
                  name="confirm-password" 
                  id="confirm-password" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword}
                  onChange={handlePasswordConfirmation}
                  autoComplete="off"
                  required={password !== ''}
                />
              </div>
              {confirmPassword && (
                <p style={{ color: passwordsMatch ? "green" : "red" }}>
                  {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
                </p>
              )}

              <div className="account-row">
                <input 
                  className="account-input"
                  type="text"
                  id="first-name"
                  name="first-name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="account-input"
                  type="text"
                  id="last-name"
                  name="last-name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div id="is-name-private">
                  <input
                    className="account-input"
                    type="checkbox"
                    id="is-name-private-checkbox"
                    name="is-name-private"
                    value={isNamePrivate}
                    checked={isNamePrivate}
                    onChange={(e) => setIsNamePrivate(e.target.checked)}
                  />
                  <label
                    htmlFor="is-name-private"
                    id="is-name-private-label"
                  >
                    Keep my name PRIVATE<br />among other users in Sirch services
                  </label>
                </div>
              </div>

              <div id='account-user-handle-row'>
                <div width="30%">
                  <p>
                  Sirch User Phrase:
                  </p>
                </div>
                <input
                  className="account-input"
                  type="text"
                  id="user-handle"
                  name="user-handle"
                  placeholder="Loading..."
                  value={userHandle}
                  readOnly
                />
                <button
                  className="account-button"
                  type="button"
                  onClick={handleSuggestNewHandle}
                > Pick Another ↺ </button>
              </div>

              <br></br>

              <button className="account-button" type="submit"> Update → </button>
            </form>
          </>
        ) : (
          <div>You must be logged in to change your user account settings.</div>
        )
      }
    </AuthContext.Consumer>
  );
}