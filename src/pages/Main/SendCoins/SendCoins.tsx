import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification, toast } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
import useDebounce from '../../../helpers/debounce';
import { Button, Input, Autocomplete, AutocompleteItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import 'react-toastify/dist/ReactToastify.css';
import './SendCoins.css';

interface User {
  user_id: string;
  user_handle: string;
  full_name: string;
}

export default function Send() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [sendAmount, setSendAmount] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [showRecipientError, setShowRecipientError] = useState<boolean>(false);
  const [showAmountError, setShowAmountError] = useState<boolean>(false);

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
    
    // Clear error when user starts typing
    if (amount && amount.trim() !== '') {
      setShowAmountError(false);
    }
  };

  const handleSearchTextChange = (newSearchText: string) => {
    // Only process search if no recipient is selected (component is not read-only)
    if (selectedRecipient !== null) {
      return;
    }

    setSearchText(newSearchText);
    setFoundUsers(null);
    
    // Clear error when user starts typing
    if (newSearchText.length > 0) {
      setShowRecipientError(false);
    }

    if (newSearchText.length === 0) {
      // cancel any pending lookups
      debouncedLookupUsers.cancel();
    } else {
      debouncedLookupUsers();
    }
  }

  const handleMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    let hasErrors = false;
    
    // Check if recipient is selected first
    if (!selectedRecipient) {
      setShowRecipientError(true);
      hasErrors = true;
    } else {
      setShowRecipientError(false);
    }
    
    // Check if amount is provided
    if (!sendAmount || sendAmount.trim() === '') {
      setShowAmountError(true);
      hasErrors = true;
    } else {
      setShowAmountError(false);
    }
    
    // If there are validation errors, don't proceed
    if (hasErrors) {
      return;
    }

    // Open confirmation modal
    onOpen();
  };

  const handleConfirmSend = async () => {
    // At this point, we know selectedRecipient is not null due to validation above
    const recipient = selectedRecipient!;

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

    if (recipient.user_id === userInTable.user_id) {
      toast.error("You cannot send ⓢ Sirch Coins to yourself! Please select a different recipient.")
      return;
    }

    try {
      const { error: transferError } = await supabase.functions.invoke('transfer-coins', {
        body: {
          sender_id: userInTable.user_id,
          recipient_id: recipient.user_id,
          amount: parseFloat(sendAmount),
          memo
        }
      });

      if (transferError) {
        toast.error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
        return;
      }

      toast.success(`ⓢ ${sendAmount} successfully sent to ${recipient.full_name} (@${recipient.user_handle})`);

      // reset the form
      setSendAmount('');
      setSearchText('');
      setSelectedRecipient(null);
      setFoundUsers(null);
      setMemo('');
      setShowRecipientError(false);
      setShowAmountError(false);

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

        <form onSubmit={handleSubmit} noValidate>
          <p>You can send Sirch Coins to your friends or others here.</p>
          <p>Please enter some details to help us identify the recipient and the amount. You may add a note.</p>
        
          <Autocomplete
            className='coin-input'
            name='searchText'
            label='Recipient'
            placeholder="Partial name, email, or @handle..."
            inputValue={selectedRecipient ? `${selectedRecipient.full_name} (@${selectedRecipient.user_handle})` : searchText}
            onInputChange={handleSearchTextChange}
            selectedKey={selectedRecipient?.user_id || null}
            onSelectionChange={(key) => {
              const user = foundUsers?.find(u => u.user_id === key);
              setSelectedRecipient(user || null);
              setShowRecipientError(false); // Clear error when user selects a recipient
              if (user) {
                setSearchText(''); // Clear search text when user is selected
              }
            }}
            onClear={() => {
              setSelectedRecipient(null);
              setSearchText('');
              setFoundUsers(null);
              setShowRecipientError(false); // Clear error when cleared
            }}
            items={foundUsers || []}
            isClearable
            variant="bordered"
            size="lg"
            radius="none"
            endContent={
              (selectedRecipient || searchText) ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecipient(null);
                    setSearchText('');
                    setFoundUsers(null);
                    setShowRecipientError(false);
                  }}
                  className="text-white hover:text-gray-300 p-1"
                  aria-label="Clear"
                >
                  ✕
                </button>
              ) : null
            }
            classNames={{
              base: "bg-black text-white",
              clearButton: "!text-white !opacity-100 !visible hover:!text-gray-300",
              endContentWrapper: "!text-white",
              selectorButton: "text-white"
            }}
            clearButtonProps={{
              className: "!text-white !opacity-100 !visible hover:!text-gray-300"
            }}
            inputProps={{
              classNames: {
                input: "bg-black text-white",
                inputWrapper: "bg-black border-white"
              }
            }}
            listboxProps={{
              emptyContent: (searchText.length !== 0 && foundUsers === null && selectedRecipient === null) ? 
                <div className="flex items-center justify-center p-4">
                  <div className="loading-spinner spin-animation mr-2"></div>
                  <span>Searching for users...</span>
                </div> :
                searchText.length !== 0 && foundUsers?.length === 0 ? 
                "No users found; please refine your search or personally invite this person to join Sirch Coins." : 
                "Start typing to search for users...",
              className: "bg-black text-white border border-white max-h-60 rounded-lg",
              itemClasses: {
                base: "bg-black text-white hover:bg-gray-800 data-[hover=true]:bg-gray-800 data-[selected=true]:bg-gray-700 rounded-md"
              }
            }}
            popoverProps={{
              classNames: {
                base: "bg-black border border-white rounded-lg",
                content: "bg-black p-0 border-none shadow-lg rounded-lg"
              },
              placement: "bottom",
              offset: 2
            }}
          >
            {(user: User) => (
              <AutocompleteItem 
                key={user.user_id} 
                textValue={`${user.full_name} (@${user.user_handle})`}
                classNames={{
                  base: "bg-black text-white hover:bg-gray-800 data-[hover=true]:bg-gray-800 data-[selected=true]:bg-gray-700 data-[focus=true]:bg-gray-800 rounded-md",
                  title: "text-white",
                  description: "text-gray-400"
                }}
              >
                <div>
                  <div className="font-bold text-white">{user.full_name}</div>
                  <div className="text-small text-gray-400">@{user.user_handle}</div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          {/* Custom error message positioned closer to the field */}
          {showRecipientError && (
            <div className="field-error-message">
              Please fill out this field
            </div>
          )}

          <Input
            className='coin-input'
            type='number'
            name='amountToSend'
            label='Amount'
            placeholder="How many ⓢ coins?"
            value={sendAmount}
            onChange={handleAmountChange}
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

          {/* Custom error message for Amount field positioned closer to the field */}
          {showAmountError && (
            <div className="field-error-message">
              Please fill out this field
            </div>
          )}

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
              Confirm...
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

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-black border border-white",
          header: "border-b border-white",
          body: "py-6",
          footer: "border-t border-white"
        }}
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Confirm Transaction
              </ModalHeader>
              <ModalBody className="text-white">
                <div className="space-y-4">
                  <p>Please confirm the following transaction details:</p>
                  <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipient:</span>
                      <span className="font-semibold">
                        {selectedRecipient?.full_name} (@{selectedRecipient?.user_handle})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-semibold text-green-400">ⓢ {sendAmount}</span>
                    </div>
                    {memo && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Note:</span>
                        <span className="font-semibold">{memo}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-gray-400">Your balance after:</span>
                      <span className="font-semibold">
                        ⓢ {userBalance ? (userBalance - parseFloat(sendAmount || '0')).toString() : '0'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone. Please verify all details are correct.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="text-white border-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={async () => {
                    await handleConfirmSend();
                    onClose();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm & Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}