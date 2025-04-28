import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext';
import { ToastNotification, toast } from '../App/ToastNotification';
import supabase from '../App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';


export default function UpdateAccount() {
  const { userInTable, userEmail, session } = useContext(AuthContext);
  const [email, setEmail] = useState(userEmail || '');
  const [isEmailPrivate, setIsEmailPrivate] = useState(userInTable?.is_email_private);
  const [hasEmailChanged, setHasEmailChanged] = useState(false);
  const [firstName, setFirstName] = useState(userInTable?.first_name);
  const [lastName, setLastName] = useState(userInTable?.last_name);
  const [isNamePrivate, setIsNamePrivate] = useState(userInTable?.is_name_private);
  const [userHandle, setUserHandle] = useState(userInTable?.user_handle);
  const navigate = useNavigate();

  
  const handleUpdate = async (event) => {
    event.preventDefault();
    
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: {
          full_name: firstName + ' ' + lastName,
          first_name: firstName,
          last_name: lastName,
          is_name_private: isNamePrivate,
          user_handle: userHandle,
          is_email_private: isEmailPrivate
        },
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        }
      });

      if (error) {
        if (isAuthApiError(error) || error.code === 'weak_password') {
          toast.error(error.message);
          return;
        }

        throw new Error(error);
      }

      toast.success("Account updated!");

      // reset form      
      if (hasEmailChanged) {
        toast.success("A verification email was sent to your new email address.");
      }
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setHasEmailChanged(newEmail !== userEmail);
  }

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
        throw new Error(error);
      }

      if (!data) {
        throw new Error("No available user handles found.");
      }

      setUserHandle(data.handles[0]);
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  };
  
  return (
    <>
      <ToastNotification />

      {
        session ? (
          <>
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
          <>
            <h3>You must be logged in to change your user account settings.</h3>
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