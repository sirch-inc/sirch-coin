import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseConfig'; 


export default function MyAccount(){
  const [deleteDialogBox, setDeleteDialogBox] = useState(false);
  const { userInTable, userBalance } = useContext(AuthContext);
  const [userHandle, setUserHandle] = useState('');
  const [isUserHandleVerified, setIsUserHandleVerified] = useState(false);

  const navigate = useNavigate();

  function showDeleteConfirmation(){
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

  // TODO: Finish and test functions - on hold pending cascade discussions
  function handleDeleteUser() {    
    const deleteUser = async () => {
      if (userInTable) {
        const { error } = await supabase.functions.invoke('delete-auth-user', {
          body: {
            user_id: userInTable.user_id
          }
        });

        if (error) {
          // TODO: surface error
          alert("Error deleting your account:\n" + error)
        } else {
          // TODO: surface alert notification with Toast
          navigate('/')
          alert("Your account has been deleted.")
        }
      }
    }

    deleteUser();
  }

  return(
    <div className="account-container">
      <h2>My Account</h2>

      <div className="account personal-info">
        <p>Email: {userInTable?.email}</p>
        <p>Name: {userInTable?.full_name + " (" + (userInTable?.is_name_private ? "PRIVATE" : "PUBLIC") + ")"}</p>
        <p>User Phrase: {userInTable?.user_handle}</p>
        <p>Balance: ⓢ {userBalance?.balance}</p>
      </div>

      <div className="account-actions">
        <h3>Account Actions</h3>
        <button
          className="big-btn"
          type="button"
          onClick={handleClickUpdateAccount}
        >
        Update Account
        </button>
        <button className="big-btn danger" onClick={showDeleteConfirmation}>Permanently Delete...</button>
      </div>

      {deleteDialogBox && 
        <dialog open className="delete-dialog">
          <h2>Confirm Account Deletion</h2>
          <p>Are you sure you want to permanently delete your account?</p>
          <p>You will forfeit all of your Sirch Coins (ⓢ 999) and will not be able to get them back. Those coins will be returned to the Sirch Coins total supply.</p>
          <p>Your prior transactions affecting other users and the Sirch Coins total supply not be deleted.</p>
          <p>This action cannot be undone. Once you delete your account, it is gone forever.</p>
          <div>
            <p>Please enter your Account User Phrase to confirm this action:</p>
            <input 
              className="account-input"
              type="text"
              id="user-handle"
              name="user-handle"
              placeholder="Your User Phrase"
              value={userHandle}
              onChange={handleVerifyUserHandle}
              required
            />
            <br></br>
            <button
              className="big-btn danger"
              onClick={handleDeleteUser}
              disabled={!isUserHandleVerified}
            >
              Yes, permanently delete
            </button>
            <button
              className="big-btn"
              onClick={() => setDeleteDialogBox(false)}>
              Cancel
            </button>
          </div>
        </dialog> 
      }
    </div>
  )
}