import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function MyAccount(){
  const [deleteDialogBox, setDeleteDialogBox] = useState(false);
  const { userInTable, userBalance } = useContext(AuthContext);

  function showDeleteConfirmation(){
    setDeleteDialogBox(true);
  }

  return(
    <div className="account-container">
      <h1>My Account</h1>

      <div className="account personal-info">
        <h2>Personal Information</h2>
        <p>Name: {userInTable?.name}</p>
        <p>Email: {userInTable?.email}</p>
        {/* TODO: Remove UserID */}
        <p>ID: {userInTable?.id} | UserID: {userInTable?.user_id}</p>
        <p>Sirch Coins Balance: {userBalance?.balance}</p>
      </div>

      <div className="account actions">
            <h2>Account Actions</h2>
            <p>Change Your Password</p>
            <button>Change Password</button>
            <p>Delete Your Account</p>
            <p>Note: This action cannot be undone. Once you delete your account, it is gone forever.</p>
            <button className="danger" onClick={showDeleteConfirmation}>Permanently Delete</button>
      </div>

      {deleteDialogBox && 
        <dialog open className="delete-dialog">
          <h2>Confirm Account Deletion</h2>
          <p>Are you sure you want to permanently delete your account? You will lose access to all of your Sirch Coins and will not be able to get them back.</p>
          <button className="danger">Yes, permanently delete</button>
          <button onClick={() => setDeleteDialogBox(false)}>Cancel</button>
        </dialog> 
      }
    </div>
)
}