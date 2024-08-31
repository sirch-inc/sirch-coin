import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import supabase from '../App/supabaseConfig';


export default function UpdateAccount() {
  const { userInTable, userEmail } = useContext(AuthContext);
  const [email, setEmail] = useState(userEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [firstName, setFirstName] = useState(userInTable?.first_name);
  const [lastName, setLastName] = useState(userInTable?.last_name);
  const [isNamePrivate, setIsNamePrivate] = useState(userInTable?.is_name_private);
  const [userHandle, setUserHandle] = useState(userInTable?.user_handle);
  // const navigate = useNavigate();

  // JEFF: remove this --------------------------------------------------------------
  // useEffect(() => {
  //   console.log("userEmail", userEmail)
  //   setEmail(userEmail);
  // }, []);

  // const fetchUserBalance = async (userInTable) => {
  //   if (userInTable) {
  //     console.log("LOADED-----------------------", userInTable)
  //   }
  // };

  // useEffect(() => {
  //   // (Re)fetch the user's balance when the component mounts
  //   fetchUserBalance(userInTable);
  // }, [userEmail, userInTable]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    
    try {
      if (!passwordsMatch) {
        // TODO: surface this error
        alert("Passwords do not match.");
        return;
      }

      const userMetaData = {
        full_name: firstName + " " + lastName,
        first_name: firstName,
        last_name: lastName,
        is_name_private: isNamePrivate,
        user_handle: userHandle
      };

      console.log('meta', userMetaData);

      let updatedUser = {
        email,
        // password,
        options: {
          // JEFF: change this redirect to something else???
          emailRedirectTo: `${window.location.origin}/welcome`,
          // data: userMetaData
        }
      };

      const { user, error } = await supabase.auth.updateUser(updatedUser);

      if (error) {
        // TODO: surface this error...
        throw error;
      }

      if (!user) {
        // TODO: do something with user
      }

      // JEFF: where do we go after this?
      // navigate("/verify-account");
    } catch (exception) {
      // TODO: surface this error
      alert("Error updating user account details:", exception);
    }
  };

  // verify passwords match
  const handlePasswordConfirmation = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // JEFF__________________________________________________
    console.log("value", value);
    console.logt("password", password);
    setPasswordsMatch(value === password);
  };

  // refresh user handle
  const handleSuggestNewHandle = async () => {
    setUserHandle('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-valid-user-handles', {
        body: {
          handleCount: 1
        }
      });
    
      if (error) {
        // TODO: surface this error...
        throw error;
      }

      setUserHandle(data.handles[0]);
    } catch (exception) {
      // TODO: surface this error
      alert("Error generating new handle(s):", exception);
    }
  };
  
  return (
    <AuthContext.Consumer>
      {({ session }) =>
        session ? (
          <>
            <h2>Update Account</h2>

            <form onSubmit={handleUpdate} autoComplete="off">
              <input 
                className="account-input"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <div className="account-row">
                <input
                  className="account-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="New Password"
                  value = {password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <input
                  className="account-input"
                  type="password" 
                  name="confirm-password" 
                  id="confirm-password" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword}
                  onChange={handlePasswordConfirmation}
                  autoComplete="off"
                  // JEFF: make this required if a new password was entered
                  // required
                />
              </div>
              {confirmPassword && (
                <p style={{ color: passwordsMatch ? "green" : "red" }}>
                  {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
                </p>
              )}

              <div className="account-row">
                <input 
                  className="account-input"
                  type="text"
                  id="first-name"
                  name="first-name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className="account-input"
                  type="text"
                  id="last-name"
                  name="last-name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <div id="is-name-private">
                  <input
                    className="account-input"
                    type="checkbox"
                    id="is-name-private-checkbox"
                    name="is-name-private"
                    value={isNamePrivate}
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
                <div width="30%">
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
                  required
                />
                <button
                  className="account-button"
                  type="button"
                  onClick={handleSuggestNewHandle}
                > Pick Another ↺ </button>
              </div>

              <br></br>

              <button className="account-button" type="submit"> Update → </button>
            </form>
          </>
        ) : (
          <div>You must be logged in to change your user account settings.</div>
        )
      }
    </AuthContext.Consumer>
  );
}