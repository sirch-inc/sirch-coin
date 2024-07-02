import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function MyAccount(){
  const { userInTable, userBalance } = useContext(AuthContext);

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
            <p>Note: This action cannot be undone. Once you delete your account, it is gone forver.</p>
            <button className="danger">Permanently Delete</button>
      </div>
    </div>
)
}