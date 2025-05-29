import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
import { Button } from '@heroui/react';
import './MyAccount.css';


export default function MyAccount(){
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const userBalance = auth?.userBalance;
  const [userHandle, setUserHandle] = useState<string>('');
  const [isUserHandleVerified, setIsUserHandleVerified] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  function showDeleteConfirmation(): void {
    setShowDeleteDialog(true);
    setUserHandle('');
    setIsUserHandleVerified(false);
  }

  const handleClickUpdateAccount = (): void => {
    navigate('/update-account');
  };

  const handleClickChangeAccountPassword = (): void => {
    navigate('/change-password');
  };

  const handleVerifyUserHandle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    setUserHandle(value);
    setIsUserHandleVerified((value === userInTable?.user_handle) || value === `@${userInTable?.user_handle}`);
  }

  async function handleDeleteUser(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!userInTable)
      return;

    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: {
          user_id: userInTable.user_id
        }
      });

      if (error) {
        throw new Error(error);
      }

      // NOTE: no need to log out here, because the user will already have been logged out when the account was deleted
      navigate('/account-deleted');

      return data;
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : String(exception));

      navigate('/error', { replace: true });
    } finally {
      setShowDeleteDialog(false);
    }
  }

  return(
    <div className='account-container'>
      <ToastNotification />

      <h1>My Account</h1>

      <div className='account personal-info'>
        <p>Login Email Address: {userInTable?.email}</p>
      </div>

      <div className='account-actions'>
        <Button
          className='big-btn'
          onPress={handleClickUpdateAccount}
        >
          Update User Profile...
        </Button>

        <Button
          className='big-btn'
          onPress={handleClickChangeAccountPassword}
        >
          Change Password...
        </Button>

        <Button className='big-btn danger' onPress={showDeleteConfirmation}> Delete Account... </Button>
      </div>
     
      {showDeleteDialog &&
        <>
          <div className='overlay'></div>
          <dialog open className='delete-dialog'>
            <h2>Confirm Account Deletion</h2>
            <h4>Are you sure you want to <i>permanently</i> delete your account?</h4>
            <ul>
              <li>Your account balance (ⓢ {userBalance}) will be LOST.</li>
              <li>All transaction history will be permanently deleted.</li>
              <li>This action CANNOT be undone.</li>
            </ul>
            <br/>

            <form onSubmit={handleDeleteUser}>
              <p>To confirm deletion, please type your Sirch user phrase exactly as shown:</p>
              <p>@{userInTable?.user_handle}</p>
              <input 
                className='account-input'
                type='text'
                id='user-handle'
                name='user-handle'
                placeholder="Type your user phrase..."
                value={userHandle}
                onChange={handleVerifyUserHandle}
                required
              />

              {!isUserHandleVerified && userHandle && (
                <p style={{ color: 'red' }}>
                  User phrase does not match, please try again.
                </p>
              )}

              <br></br>

              <Button
                className='big-btn danger'
                type='submit'
                // TODO: disabling this for now until we sort out HOW we want to handle user-deletions completely...
                // onPress={handleDeleteUser}
                disabled={!isUserHandleVerified}
              >
                Yes, permanently delete
              </Button>
              
              <Button
                className='big-btn'
                onPress={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </form>
          </dialog> 
        </>
      }

      <div className='bottom-btn-container'>
        <Button 
          className='big-btn'
          onPress={() => { navigate(-1); }}>
          Back
        </Button>
      </div>
    </div>
  )
}