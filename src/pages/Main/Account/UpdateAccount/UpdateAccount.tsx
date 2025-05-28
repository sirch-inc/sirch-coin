import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button } from '@heroui/react';
import './UpdateAccount.css';


export default function UpdateAccount() {
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const userEmail = auth?.userEmail;
  const session = auth?.session;
  const [email, setEmail] = useState<string>(userEmail || '');
  const [isEmailPrivate, setIsEmailPrivate] = useState<boolean>(userInTable?.is_email_private ?? false);
  const [hasEmailChanged, setHasEmailChanged] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(userInTable?.first_name || '');
  const [lastName, setLastName] = useState<string>(userInTable?.last_name || '');
  const [isNamePrivate, setIsNamePrivate] = useState<boolean>(userInTable?.is_name_private ?? false);
  const [userHandle, setUserHandle] = useState<string>(userInTable?.user_handle || '');
  const navigate = useNavigate();

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
        }
      });

      if (error) {
        if (isAuthApiError(error) || error.code === 'weak_password') {
          toast.error(error.message);
          return;
        }

        throw error;
      }

      toast.success("Account updated!");

      if (hasEmailChanged) {
        toast.success("A verification email was sent to your new email address.");
      }
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : String(exception));
      navigate('/error', { replace: true });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setHasEmailChanged(newEmail !== userEmail);
  };

  const handleSuggestNewHandle = async (): Promise<void> => {
    setUserHandle('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-valid-user-handles', {
        body: {
          handleCount: 1
        }
      });
    
      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No available user handles found.");
      }

      setUserHandle(data.handles[0]);
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : String(exception));
      navigate('/error', { replace: true });
    }
  };
  
  return (
    <>
      <ToastNotification />

      {session ? (
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
                onChange={handleEmailChange}
                autoComplete="email"
              />
              <div id="is-email-private">
                <input
                  className="account-input"
                  type="checkbox"
                  id="is-email-private-checkbox"
                  name="is-email-private"
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
              <div style={{ width: '30%' }}>
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
              <Button
                className="account-button"
                onClick={handleSuggestNewHandle}
              > Pick Another ↺ </Button>
            </div>

            <br />

            <Button className="account-button" type="submit"> Update → </Button>
          </form>
        </>
      ) : (
        <>
          <h3>You must be logged in to change your user account settings.</h3>
          <br/>
        </>
      )}

      <div className='bottom-btn-container'>
        <Button 
          className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </Button>
      </div>
    </>
  );
}