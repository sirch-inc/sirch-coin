import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider';
import { ToastContainer, toast } from 'react-toastify';
import Logout from '../Account/Logout';


export default function MyAccount(){
  const [deleteDialogBox, setDeleteDialogBox] = useState(false);
  const { userInTable, userBalance } = useContext(AuthContext);
  const [userHandle, setUserHandle] = useState('');
  const [isUserHandleVerified, setIsUserHandleVerified] = useState(false);

  const navigate = useNavigate();

  function showDeleteConfirmation() {
    setDeleteDialogBox(true);
  }

  const handleClickUpdateAccount = async () => {
    navigate('/update-account');
  };

  const handleVerifyUserHandle = (e) => {
    const value = e.target.value;

    setUserHandle(value);
    setIsUserHandleVerified(value === userInTable.user_handle);
  };

  function handleDeleteUser() {  
    event.preventDefault();
  
    const deleteUser = async () => {
      if (userInTable) {
        const { error } = await supabase.functions.invoke('delete-auth-user', {
          body: {
            user_id: userInTable.user_id
          }
        });

        if (error) {
          toast.error("There was an error deleting your account. Please try again later or contact technical support.");
          return;
        }

        setDeleteDialogBox(false);
        Logout();
        navigate('/user-deleted');
      }
    }

    deleteUser();
  }

  return(
    <div className='account-container'>
      <ToastContainer
        position='top-right'
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme='colored'
      />

      <h2>My Account</h2>

      <div className='account personal-info'>
        <p>Account Login: {userInTable?.email}</p>
      </div>

      <div className='account-actions'>
        <h3>Account Actions</h3>
        <button
          className='big-btn'
          type='button'
          onClick={handleClickUpdateAccount}
        >
        Update Account
        </button>
        <button className='big-btn danger' onClick={showDeleteConfirmation}>Delete Account...</button>
      </div>
     
      {deleteDialogBox &&
        <>
          <div className='overlay'></div>
          <dialog open className='delete-dialog'>
            <h2>Confirm Account Deletion</h2>
            <h4>Are you sure you want to <br></br><i>permanently delete</i> your account?</h4>
            <ul>
              <li>You will forfeit all of your ⓢ {userBalance?.balance} Sirch Coins and will not be able to get them back. Those coins will be returned to the Sirch Coins total supply.</li>
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
                  placeholder="Your User Handle"
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
                  // onClick={handleDeleteUser}
                  disabled={!isUserHandleVerified}
                >
                  Yes, permanently delete
                </button>
                <button
                  className='big-btn'
                  onClick={() => setDeleteDialogBox(false)}>
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