import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./AuthContext";
import supabase from "./App/supabaseConfig";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// TODO: move this into its own component file with proper PROPs validation
export function UserCard({user, handleUserCardSelected}) {
  return (
    <div
      className="user-card"
      onClick={(e) => handleUserCardSelected(user)}
      >
      <p>
        Handle: {user.user_handle}
      </p>
      <p>
        Name: {user.full_name}
      </p>
    </div>
  );
}

export default function Send() {
  const { userInTable, userBalance } = useContext(AuthContext);
  const [sendAmount, setSendAmount] = useState('');
  const [searchText, setSearchText] = useState('');
  const [memo, setMemo] = useState('');
  const [currentBalance, setCurrentBalance] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipientError, setRecipientError] = useState(false);

  const fetchUserBalance = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', userInTable.user_id)
        .single();

        if (error) {
          toast.error("Unable to load user balance");
        } else {
        setCurrentBalance(data.balance);
      }
    }
  };

  useEffect(() => {
    // (Re)fetch the user's balance when the component renders
    fetchUserBalance(userInTable);
  }, [userBalance]);


  const handleAmountChange = (event) => {
    const amount = event.target.value;

    setSendAmount(amount < 0 ? "" : amount);
  };

  const handleSearchTextChange = async (event) => {
    // TODO: debounce this!
    const newSearchText = event.target.value;
    
    setSearchText(newSearchText);
    
    setSelectedRecipient(null);

    try {
      const { data: foundUsersData, error: foundUsersError } = await supabase.functions.invoke('lookup-user', {
        body: {
          userId: userInTable.user_id,
          searchText: newSearchText
        }
      });

      if (foundUsersError) {
        // TODO: surface this error in a toast
        alert('Error looking up users: \n' + foundUsersError);
        return;
      }

      const newFoundUsers = foundUsersData.found;
      setFoundUsers(newFoundUsers);

      // none found
      if (newFoundUsers.length === 0) {
        setSelectedRecipient(null);
      }

      // one found
      if (newFoundUsers.length === 1) {
        setSelectedRecipient(newFoundUsers[0]);
      }

      // many found
      if (foundUsers.length > 1) {
        setSelectedRecipient(null);
      } 
    } catch (exception) {
      console.error("An exception occurred:", exception);

      // TODO: what to display here?
      toast.error('An exception occurred', exception);
    }
  };

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const handleAcknowledgeRecipientError = () => {
    setRecipientError(false);
  };

  const handleUserCardSelected = (user) => {
    setSelectedRecipient(user);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    fetchUserBalance(userInTable);

    // verify the sender has sufficient balance
    if (sendAmount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }
    
    // if the send amount equals the user's balance, display a warning & confirmation dialog
    if (parseInt(sendAmount, 10) === currentBalance) {
      // TODO: handle this confirmation with a proper dialog
      if (!confirm("Warning: the amount to send (ⓢ " + sendAmount + ") is your entire balance! Please confirm your intent.")) {
        return;
      }
    }
  
    if (selectedRecipient === null) {
      alert("No selected recipient");
      return;
    }

    if (selectedRecipient.user_id === userInTable.user_id) {
      // TODO: handle this gracefully
      alert("You cannot send ⓢ Sirch Coins to yourself!")
      return;
    }

    try {
        // TODO: Invite User; either rework this use case, or conduct the invitation on the server
        // const confirmedResponse = confirm("The recipient (" + searchText + ") does not appear to have a Sirch Coins account.  Would you like to send this person an invitation to join Sirch Coins?");
        // if (confirmedResponse) {
        //   const { data, error } = await supabase.auth.admin.inviteUserByEmail(searchText);
        //   if (error) {
        //     // TODO: surface this error
        //     console.error("Error inviting recipient:", error);
        //   } else {
        //     // TODO: indicate success to the user
        //     alert("Invitation successful!");
        //     setSendAmount("");
        //     setSearchText("");
        //   }
        //   return;
        // }

      const { data: transferData, error: transferError } = await supabase.functions.invoke('transfer_coins', {
        body: {
          sender_id: userInTable.user_id,
          recipient_id: selectedRecipient.user_id,
          amount: sendAmount,
          memo
        }
      });

      if (transferError) {
        // TODO: hande this error gracefully
        alert('Error transferring coins:\n' + transferError);
        return;
      }

      if (transferError?.message) {
        toast.error(transferError?.message);
        // FIXME: hack to get around linter
        console.log("Data", transferData);
      } else {
        toast.success("ⓢ " + sendAmount + " successfully sent to " + selectedRecipient?.full_name + "(@" + selectedRecipient?.user_handle + ")");

        // reset the form
        setSendAmount('');
        setSearchText('');
        setSelectedRecipient(null);
        setFoundUsers([]);
        setMemo('');

        // TODO: consider refactoring this and other similar calls into a provider or the context
        fetchUserBalance(userInTable);
      }
    } catch (exception) {
      console.error("An exception occurred", exception);

      // TODO: what to display here?
      toast.error('An exception occurred', exception);
    }
  };

  return (  
    <>
      <ToastContainer
        position = 'top-right'
        autoClose = {false}
        newestOnTop = {false}
        closeOnClick
        draggable
        theme = 'colored'
      />
      <div className = 'send-coin-container'>
      {recipientError
        ?
        <>
          <h3>
            The recipient ({searchText}) does not appear to have a Sirch Coins account.
            <br/>
            <br/>
            Please check the email address or invite this individual to join Sirch Coins!
          </h3>
          <button
            onClick={handleAcknowledgeRecipientError}
          >
            Got it!
          </button>
        </>
        :
        <div>
          <div>
            <h2>Send</h2>
          </div>
          <form onSubmit = {handleSubmit}>
            <div className = 'price-container'>
              <input
                className = 'coin-input'
                id = 'amountToSend'
                name = 'amountToSend'
                placeholder = "how many ⓢ coins?"
                required
                type = 'number'
                min = '1'
                max = {currentBalance || '0'}
                step = '1'
                value = {sendAmount}
                onChange = {handleAmountChange}
              />

              <div className = 'search-text'>
                <input
                  className = 'coin-input'
                  id = 'searchText'
                  name = 'searchText'
                  placeholder = "Name, email, or user handle..."
                  value = {searchText}                
                  type = 'text'
                  onChange = {handleSearchTextChange}
                  required
                />
              </div>

              {searchText.length && foundUsers.length === 0 &&
                <>
                  <h3 style={{ color: 'red' }}>
                    No user found; please search again<br/>
                    or invite the user for whom you are looking<br/>
                    to join Sirch Coins.
                  </h3>
                </>
              }

              {searchText.length && selectedRecipient !== null &&
                <>
                  <h3 style={{ color: 'green' }}>
                    Selected User <br/>
                    {selectedRecipient?.full_name} (@{selectedRecipient?.user_handle})
                  </h3>
                </>
              }

              { foundUsers.length > 1 && selectedRecipient === null &&
                <>
                  <h3>Multiple users found. Please select one...</h3>
                  { foundUsers.length > 1 &&
                    (
                      foundUsers.map((foundUser) => (
                        <UserCard 
                          key={foundUser.user_id}
                          user={foundUser}
                          handleUserCardSelected={handleUserCardSelected}
                        />
                      ))
                    )
                  }
                </>
              }
              
              <div className = 'memo-input'>
                <input
                  className = 'coin-input'
                  id = 'memo'
                  name = 'memo'
                  placeholder = "leave a note?"
                  type = 'text'
                  value = {memo}
                  maxLength = '60'
                  onChange = {handleMemoChange}
                  autoComplete = 'memo'
                />
              </div>

              {/* TODO: Dynamically update dollar amount based on coin to dollar */}
              <div>
                <p>You now have <span className = 'bold-coin'> {currentBalance !== null ? "ⓢ " + currentBalance : "Loading"}</span> / $ {(currentBalance*0.10).toFixed(2)}</p>
              </div>
            </div>
            <div className = 'bottom-btn-container'>
              <Link to = '/' className = 'big-btn'>
                Back
              </Link>
              <button type = 'submit' className = 'send-btn big-btn'>
                Send
              </button>
            </div>
          </form>
        </div>
      }
      </div>
    </>
  );
}