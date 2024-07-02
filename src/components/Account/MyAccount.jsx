import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function MyAccount(){
  const { userInTable, userBalance } = useContext(AuthContext);
  console.log(userBalance.balance)
  return(
    <div className="account-container">
      <h1>My Account</h1>

      <div className="account personal-info">
        <h2>Personal Information</h2>
        <p>Name: {userInTable?.name}</p>
        <p>Email: {userInTable?.email}</p>
        {/* TODO: Remove UserID */}
        <p>ID: {userInTable?.id} | UserID: {userInTable.user_id}</p>
        <p>Sirch Coins Balance: {userBalance?.balance}</p>
      </div>

      <div className="account actions">
            <h2>Account Actions</h2>
            <p>Password</p>
            <button>Change Password</button>
            <p>Delete Account</p>
            <button>Permanently Delete</button>
      </div>
    </div>
)
}