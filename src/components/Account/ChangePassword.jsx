import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import supabase from '../App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';


// TODO: ...and we would then remove the password fields from "UpdateUser".
// TODO: Send an email informing the user of the password change.
export default function ChangePassword(props) {
  const { isPasswordRecoverySession = false } = props;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  

  async function submitPasswordChange(e) {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // TODO: consider using supabase.auth.reauthenticate() and/or supabase.auth.resend() here...
      const { data: user, error } = await supabase.auth.updateUser(
        { password: newPassword },
        { session }
      );
      
      if (error) {
        if (isAuthApiError(error)) {
          toast.error(error.message);
          return;
        }

        throw new Error(error);
      }

      if (!user) {
        throw new Error("No user updated.");
      }

      toast.success('Password updated successfully!');
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  }

  // verify passwords match
  const handlePasswordConfirmation = (e) =>{
    const value = e.target.value;

    setConfirmPassword(value);
    setPasswordsMatch(value === newPassword)
  }

  return(
    <>
      <ToastContainer
        position = 'top-right'
        autoClose = {false}
        newestOnTop = {false}
        closeOnClick
        draggable
        theme = 'colored'
      />

      {!isPasswordRecoverySession && <h1>Change Password</h1>}

      <p>Enter a new password for your Sirch Coins account below.</p>

      <form onSubmit={submitPasswordChange}>
        <input
          className='account-input'
          type='password'
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete='off'
          required
        />

        <input
          className='account-input'
          type='password'
          placeholder="Confirm New Password"
          value={confirmPassword}
          name='confirm-password'
          onChange={handlePasswordConfirmation}
          autoComplete='off'
          required
        />

        {confirmPassword && (
          <p style={{ color: passwordsMatch ? 'green' : 'red' }}>
            {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
          </p>
        )}

        <br/>

        <button className='account-button' type='submit'> {isPasswordRecoverySession ? "Reset" : "Change"} Password → </button>
      </form>

      {!isPasswordRecoverySession &&
        <div className='bottom-btn-container'>
          <button className='big-btn'
            onClick={() => { navigate(-1); }}>
            Back
          </button>
        </div>
      }

    </>
  )
}

ChangePassword.propTypes = {
  isPasswordRecoverySession: PropTypes.boolean
};