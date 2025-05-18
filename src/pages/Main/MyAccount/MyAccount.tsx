import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
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
    setIsUserHandleVerified(value === userInTable?.user_handle);
  };

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
        <button
          className='big-btn'
          type='button'
          onClick={handleClickUpdateAccount}
        >
          Update User Profile...
        </button>

        <button
          className='big-btn'
          type='button'
          onClick={handleClickChangeAccountPassword}
        >
          Change Password...
        </button>

        <button className='big-btn danger' onClick={showDeleteConfirmation}> Delete Account... </button>
      </div>
     
      {showDeleteDialog &&
        <>
          <div className='overlay'></div>
          <dialog open className='delete-dialog'>
            <h2>Confirm Account Deletion</h2>
            <h4>Are you sure you want to <i>permanently</i> delete your account?</h4>
            <ul>
              <li>You will forfeit all of your ⓢ {userBalance} Sirch Coins and will not be able to get them back. Those coins will be returned to the Sirch Coins total supply.</li>
              <li>Your prior transactions affecting other users and the Sirch Coins total supply not be deleted.</li>
              <li>This action cannot be undone. Once you delete your account, it is gone forever.</li>
            </ul>
            <div>
              <h4>Please enter your two-word Account Handle to confirm this action:</h4>
              <form onSubmit={handleDeleteUser} autoComplete='off'>
                <input
                  className='account-input'
                  type='text'
                  id='user-handle'
                  name='user-handle'
                  placeholder="Your Account Handle"
                  value={userHandle}
                  onChange={handleVerifyUserHandle}
                  required
                />
                {userHandle && (
                  <p style={{ color: isUserHandleVerified ? "green" : "red" }}>
                    {isUserHandleVerified ? "Verified!" : "Not Verified"}
                  </p>
                )}

                <br></br>

                <button
                  className='big-btn danger'
                  type='submit'
                  // TODO: disabling this for now until we sort out HOW we want to handle user-deletions completely...
                  // onClick={handleDeleteUser}
                  disabled={!isUserHandleVerified}
                >
                  Yes, permanently delete
                </button>
                
                <button
                  className='big-btn'
                  onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </dialog> 
        </>
      }

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </div>
  )
}