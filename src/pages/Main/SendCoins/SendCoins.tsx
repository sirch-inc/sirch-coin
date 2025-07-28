import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification, toast } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
import useDebounce from '../../../helpers/debounce';
import { Button, Input } from '@heroui/react';
import 'react-toastify/dist/ReactToastify.css';
import './SendCoins.css';

interface User {
  user_id: string;
  user_handle: string;
  full_name: string;
}

interface UserCardProps {
  user: User;
  handleUserCardSelected: (user: User) => void;
}

// TODO: convert this to a button element/component
export function UserCard({ user, handleUserCardSelected }: UserCardProps) {
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
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [sendAmount, setSendAmount] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);

  const fetchUserBalance = useCallback(async () => {
    if (authContext?.refreshUserBalance) {
      await authContext.refreshUserBalance();
    }
  }, [authContext]);

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

      const newFoundUsers = foundUsersData.found as User[];
      setFoundUsers(newFoundUsers);

      // none found
      if (newFoundUsers.length === 0) {
        setSelectedRecipient(null);
      }

      // one found
      if (newFoundUsers.length === 1) {
        setSelectedRecipient(newFoundUsers[0] || null);
      }

      // many found
      if (newFoundUsers.length > 1) {
        setSelectedRecipient(null);
      }
    } catch (exception) {
      if (exception instanceof Error) {
        console.error("An exception occurred:", exception.message);
      }
      toast.error("Unable to look up users at this time. Please try again later.");
    }
  });

  // (re)fetch the user's balance when the component renders
  useEffect(() => {
    fetchUserBalance();
  }, [fetchUserBalance]);

  // cancel any pending lookup when unmounting component
  useEffect(() => {
    return () => {
      debouncedLookupUsers.cancel();
    };
   }, [debouncedLookupUsers]);

  if (!authContext) {
    navigate('/');
    return null;
  }

  const { userInTable, userBalance } = authContext;

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    setSendAmount(parseFloat(amount) < 0 ? '' : amount);
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUserCardSelected = (user: User) => {
    setSelectedRecipient(user);
  };

  const handleMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    await fetchUserBalance();

    if (!userBalance || !userInTable) {
      toast.error("Unable to verify balance. Please try again.");
      return;
    }

    // verify the sender has sufficient balance
    if (parseFloat(sendAmount) > userBalance) {
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
          amount: parseFloat(sendAmount),
          memo
        }
      });

      if (transferError) {
        toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
        return;
      }

      toast.success(`ⓢ ${sendAmount} successfully sent to ${selectedRecipient.full_name} (@${selectedRecipient.user_handle})`);

      // reset the form
      setSendAmount('');
      setSearchText('');
      setSelectedRecipient(null);
      setFoundUsers(null);
      setMemo('');

      await fetchUserBalance();
    } catch (exception) {
      if (exception instanceof Error) {
        console.error("An exception occurred:", exception.message);
      }
      toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
    }
  };

  return (  
    <>
      <ToastNotification />

      <div className='send-coin-container'>
        <h2>Send ⓢ</h2>

        <form onSubmit={handleSubmit}>
          <p>You can send Sirch Coins to your friends or others here.</p>
          <p>Please enter some details to help us identify the recipient and the amount. You may add a note.</p>
        
          <Input
            className='coin-input'
            type='text'
            name='searchText'
            label='Recipient'
            placeholder="To whom? Partial name, email, or @handle..."
            value={searchText}
            onChange={handleSearchTextChange}
            // HeroUI Input component props
            isRequired
            isClearable
            variant="bordered"
            size="lg"
            radius="none"
            classNames={{
              input: "bg-black text-white",
              inputWrapper: "bg-black border-white"
            }}
          />

          <>
            {searchText.length !== 0 && foundUsers === null &&
              <h3 style={{ color: 'white' }}>
                Loading...
              </h3>
            }

            {searchText.length !== 0 && foundUsers?.length === 0 &&
              <h3 style={{ color: 'red' }}>
                No users found; please refine your search<br/>
                or invite the person for whom you are looking<br/>
                to join Sirch Coins.
              </h3>
            }

            {selectedRecipient !== null &&
              <h3 style={{ color: 'green' }}>
                {selectedRecipient.full_name} (@{selectedRecipient.user_handle})
              </h3>
            }

            {foundUsers && foundUsers.length > 1 && selectedRecipient === null && (
              <>
                <h3>Multiple users found. Please select one...</h3>
                {foundUsers.map((foundUser) => (
                  <UserCard 
                    key={foundUser.user_id}
                    user={foundUser}
                    handleUserCardSelected={handleUserCardSelected}
                  />
                ))}
              </>
            )}
          </>

          <Input
            className='coin-input'
            type='number'
            name='amountToSend'
            label='Amount'
            placeholder="How many ⓢ coins?"
            value={sendAmount}
            onChange={handleAmountChange}
            isRequired
            variant="bordered"
            size="lg"
            radius="none"
            classNames={{
              input: "bg-black text-white",
              inputWrapper: "bg-black border-white"
            }}
            min="1"
            max={userBalance?.toString() || "0"}
            step="1"
          />

          <div className='memo-input'>
            <Input
              className='coin-input'
              type='text'
              name='memo'
              label='Note (Optional)'
              placeholder="Leave a note?"
              value={memo}
              onChange={handleMemoChange}
              variant="bordered"
              size="lg"
              radius="none"
              classNames={{
                input: "bg-black text-white",
                inputWrapper: "bg-black border-white"
              }}
              maxLength={60}
            />
          </div>
          
          <div className='bottom-btn-container'>
            <Button type='submit' className='big-btn'>
              Send
            </Button>

            <Button 
              className='big-btn' 
              onPress={() => { navigate(-1); }}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}