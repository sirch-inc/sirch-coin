import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import supabase from './App/supabaseProvider.js';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDebounce from '../helpers/debounce.js'


// TODO: move this into its own component file with proper react props validations
// eslint-disable-next-line react/prop-types
export function UserCard({user, handleUserCardSelected}) {
  return (
    <div
      className='user-card'
      onClick={() => handleUserCardSelected(user)}
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
  const { userInTable, userBalance, refreshUserBalance } = useContext(AuthContext);
  const [sendAmount, setSendAmount] = useState('');
  const [searchText, setSearchText] = useState('');
  const [memo, setMemo] = useState('');
  const [foundUsers, setFoundUsers] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const fetchUserBalance = async () => {
    await refreshUserBalance();
  };

  const debouncedLookupUsers = useDebounce(async () => {
    setSelectedRecipient(null);

    try {
      const { data: foundUsersData, error: foundUsersError } = await supabase.functions.invoke('lookup-user', {
        body: {
          searchText
        }
      });

      if (foundUsersError) {
        toast.error("Unable to look up users at this time. Please try again later.");
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
      if (newFoundUsers.length > 1) {
        setSelectedRecipient(null);
      }
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

      toast.error("Unable to look up users at this time. Please try again later.");
    }
  });

  const handleAmountChange = (event) => {
    const amount = event.target.value;

    setSendAmount(amount < 0 ? '' : amount);
  };

  const handleSearchTextChange = (event) => {
    const newSearchText = event.target.value;

    setSearchText(newSearchText);
    setFoundUsers(null);
    setSelectedRecipient(null);

    if (newSearchText.length === 0) {
      // cancel any pending lookups
      debouncedLookupUsers.cancel();
    } else {
      debouncedLookupUsers();
    }
  }

  const handleUserCardSelected = (user) => {
    setSelectedRecipient(user);
  };

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    fetchUserBalance();

    // verify the sender has sufficient balance
    if (sendAmount > userBalance) {
      toast.error("Insufficient balance.");
      return;
    }
  
    if (selectedRecipient === null) {
      toast.error("Please select a recipient.");
      return;
    }

    if (selectedRecipient.user_id === userInTable.user_id) {
      toast.error("You cannot send ⓢ Sirch Coins to yourself! Please select a different recipient.")
      return;
    }

    try {
      const { error: transferError } = await supabase.functions.invoke('transfer-coins', {
        body: {
          sender_id: userInTable.user_id,
          recipient_id: selectedRecipient.user_id,
          amount: sendAmount,
          memo
        }
      });

      if (transferError) {
        toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
        return;
      }

      if (transferError?.message) {
        toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
      } else {
        toast.success("ⓢ " + sendAmount + " successfully sent to " + selectedRecipient?.full_name + " (@" + selectedRecipient?.user_handle + ")");

        // reset the form
        setSendAmount('');
        setSearchText('');
        setSelectedRecipient(null);
        setFoundUsers(null);
        setMemo('');

        fetchUserBalance();
      }
    } catch (exception) {
      console.error("An exception occurred", exception.message);

      toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
    }
  };

  // (re)fetch the user's balance when the component renders
  useEffect(() => {
    fetchUserBalance();
  }, [userBalance]);

  // cancel any pending lookup when unmounting component
  useEffect(() => {
    return () => {
      debouncedLookupUsers.cancel();
    };
   }, [debouncedLookupUsers]);

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
        <h2>Send</h2>
        <form onSubmit = {handleSubmit}>
          <div className = 'price-container'>
            <div className = 'search-text'>
              <h2>To whom:</h2>
              <input
                className = 'coin-input'
                id = 'searchText'
                name = 'searchText'
                placeholder = "User name, email, or @handle..."
                value = {searchText}                
                type = 'text'
                onChange = {handleSearchTextChange}
              />
            </div>

            <>
              {searchText.length !== 0 && foundUsers === null &&
                <h3 style={{ color: 'black' }}>
                  Loading...
                </h3>
              }

              {searchText.length !== 0 && foundUsers?.length === 0 &&
                <h3 style={{ color: 'red' }}>
                  No users found; please refine your search<br/>
                  or invite the user for whom you are looking<br/>
                  to join Sirch Coins.
                </h3>
              }

              {selectedRecipient !== null &&
                <h3 style={{ color: 'green' }}>
                  {selectedRecipient?.full_name} (@{selectedRecipient?.user_handle})
                </h3>
              }

              {foundUsers?.length > 1 && selectedRecipient === null &&
                (
                  <h3>Multiple users found. Please select one...</h3> &&
                  (
                    foundUsers.map((foundUser) => (
                      <UserCard 
                        key={foundUser.user_id}
                        user={foundUser}
                        handleUserCardSelected={handleUserCardSelected}
                      />
                    ))
                  )
                )
              }
            </>

            <input
              className = 'coin-input'
              id = 'amountToSend'
              name = 'amountToSend'
              placeholder = "how many ⓢ coins?"
              required
              type = 'number'
              min = '1'
              max = {userBalance || '0'}
              step = '1'
              value = {sendAmount}
              onChange = {handleAmountChange}
            />

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
          </div>
          
          <div className = 'bottom-btn-container'>
            <button type = 'submit' className = 'send-btn big-btn'>
              Send
            </button>
            <Link to = '/' className = 'big-btn'>
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}