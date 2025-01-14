import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import PropTypes from 'prop-types';
import { ToastNotification, toast } from '../App/ToastNotification';
import supabase from '../App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';


// TODO: Send an email informing the user of the password change.
export default function ChangePassword(props) {
  const { standalone = true } = props;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const submitRequest = async (e) => {
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
        if (isAuthApiError(error) || error.code === 'weak_password') {
          toast.error(error.message);
          return;
        }

        throw new Error(error);
      }

      if (!user) {
        throw new Error("No user updated.");
      }

      // reset form
      setNewPassword('');
      setConfirmPassword('');

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
      <ToastNotification />

      {standalone && <h1>Change Password</h1>}

      <p>Enter a new password for your Sirch Coins account below.</p>

      <form onSubmit={submitRequest}>
        <input
          className='account-input'
          id='password'
          name='password'
          type='password'
          placeholder="New Password"
          minLength='6'
          maxLength='64'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete='off'
          required
        />

        <input
          className='account-input'
          id='password'
          name='password'
          type='password'
          placeholder="Confirm New Password"
          minLength='6'
          maxLength='64'
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

        <button className='account-button' type='submit'> {standalone ? "Change" : "Reset"} Password → </button>
      </form>

      {standalone &&
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
  standalone: PropTypes.boolean
};