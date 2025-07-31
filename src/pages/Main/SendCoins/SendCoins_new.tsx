import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification, toast } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
import useDebounce from '../../../helpers/debounce';
import { Button, Autocomplete, AutocompleteItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { SirchNumberInput, SirchTextInput } from '../../../components/HeroUIFormComponents';
import { useFormValidation, useAsyncOperation } from '../../../hooks';
import 'react-toastify/dist/ReactToastify.css';
import './SendCoins.css';

interface User {
  user_id: string;
  full_name: string;
  user_handle: string;
  email: string;
}

interface SendCoinsFormData {
  amount: string;
  recipient?: User | null;
  searchText: string;
  memo: string;
  selectedRecipient: User | null;
}

interface ValidationErrors {
  recipient?: string;
  amount?: string;
  balance?: string; 
  searchText?: string;
  memo?: string;
}

export default function Send() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // Early return for auth check - but we need to get user data first
  if (!authContext) {
    navigate('/');
    return null;
  }

  const { userInTable, userBalance } = authContext;

  // Initialize form data
  const initialFormData: SendCoinsFormData = {
    amount: '',
    searchText: '',
    memo: '',
    selectedRecipient: null
  };

  // Validation rules using shared utilities
  const validationRules = useMemo(() => ({
    recipient: (value: unknown) => {
      const recipient = value as User | null;
      return recipient ? { isValid: true } : { isValid: false, message: "Please select a recipient" };
    },
    amount: (value: unknown) => {
      const amount = value as string;
      const numAmount = parseFloat(amount);
      
      if (!amount || amount.trim() === '') {
        return { isValid: false, message: "Amount is required" };
      }
      if (isNaN(numAmount) || numAmount <= 0) {
        return { isValid: false, message: "Please enter a valid amount" };
      }
      return { isValid: true };
    },
    balance: (value: unknown) => {
      const amount = value as string;
      const numAmount = parseFloat(amount);
      
      if (userBalance && !isNaN(numAmount) && numAmount > userBalance) {
        return { isValid: false, message: `Insufficient balance. You have ⓢ ${userBalance} available.` };
      }
      return { isValid: true };
    },
    searchText: () => ({ isValid: true }), // Search text doesn't need validation
    memo: () => ({ isValid: true }) // Memo is optional
  }), [userBalance]);

  // Use form validation hook
  const {
    formData,
    errors,
    handleInputChange,
    resetForm: resetFormHook,
    getFieldError
  } = useFormValidation<SendCoinsFormData, ValidationErrors>({
    initialData: initialFormData,
    validationRules
  });

  // Use async operation hooks
  const transferOperation = useAsyncOperation();
  const userLookupOperation = useAsyncOperation();

  // Additional state for user search functionality
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);

  const fetchUserBalance = useCallback(async () => {
    if (authContext?.refreshUserBalance) {
      await authContext.refreshUserBalance();
    }
  }, [authContext]);

  // Debounced user lookup
  const lookupUsers = useCallback(async () => {
    if (!formData.searchText || formData.selectedRecipient) return;

    await userLookupOperation.execute(async () => {
      const { data: newFoundUsers, error } = await supabase.functions.invoke('lookup-users', {
        body: { searchText: formData.searchText }
      });

      if (error) {
        throw new Error("Error looking up users");
      }

      setFoundUsers(newFoundUsers || []);
      
      // Auto-select if exactly one match
      if (newFoundUsers?.length === 1) {
        handleInputChange('selectedRecipient', newFoundUsers[0]);
      }
    });
  }, [formData.searchText, formData.selectedRecipient, userLookupOperation, handleInputChange]);

  const debouncedLookupUsers = useMemo(() => 
    useDebounce(lookupUsers, 350), 
    [lookupUsers]
  );

  // Enhanced input handlers
  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    const validAmount = parseFloat(amount) < 0 ? '' : amount;
    handleInputChange('amount', validAmount);
    
    // Also validate balance in real-time
    if (validAmount && userBalance) {
      const parsedAmount = parseFloat(validAmount);
      if (parsedAmount > userBalance) {
        // This will be caught by the balance validation rule
      }
    }
  }, [handleInputChange, userBalance]);

  const handleSearchTextChange = useCallback((newSearchText: string) => {
    // Only process search if no recipient is selected
    if (formData.selectedRecipient) return;

    handleInputChange('searchText', newSearchText);
    setFoundUsers(null);
    
    // Clear error and trigger search
    if (newSearchText.length > 0) {
      debouncedLookupUsers();
    } else {
      debouncedLookupUsers.cancel();
    }
  }, [formData.selectedRecipient, handleInputChange, debouncedLookupUsers]);

  const handleMemoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('memo', event.target.value);
  }, [handleInputChange]);

  const resetForm = useCallback(() => {
    resetFormHook();
    setFoundUsers(null);
  }, [resetFormHook]);

  const clearRecipient = useCallback(() => {
    handleInputChange('selectedRecipient', null);
    handleInputChange('searchText', '');
    setFoundUsers(null);
  }, [handleInputChange]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before opening confirmation
    const recipient = formData.selectedRecipient;
    const amount = formData.amount;
    
    if (!recipient) {
      toast.error("Please select a recipient.");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    
    onOpen();
  }, [formData, onOpen]);

  const handleConfirmSend = useCallback(async () => {
    const recipient = formData.selectedRecipient;
    
    if (!recipient) {
      toast.error("Please select a recipient.");
      return;
    }

    await fetchUserBalance();
    
    if (!userBalance || !userInTable) {
      toast.error("Unable to verify balance. Please try again.");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount > userBalance) {
      toast.error("Insufficient balance.");
      return;
    }

    if (recipient.user_id === userInTable.user_id) {
      toast.error("You cannot send ⓢ Sirch Coins to yourself! Please select a different recipient.");
      return;
    }

    await transferOperation.execute(
      async () => {
        const { error: transferError } = await supabase.functions.invoke('transfer-coins', {
          body: {
            sender_id: userInTable.user_id,
            recipient_id: recipient.user_id,
            amount,
            memo: formData.memo
          }
        });

        if (transferError) {
          throw new Error("An error occurred sending Sirch Coins to your recipient. Please try again later.");
        }

        resetForm();
        await fetchUserBalance();
        onClose();
        toast.success(`Successfully sent ⓢ ${amount} Sirch Coins to ${recipient.full_name}!`);
        navigate('/');
      },
      "Error sending coins"
    );
  }, [formData, userBalance, userInTable, transferOperation, resetForm, fetchUserBalance, onClose, navigate]);

  const onClose = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

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

  return (
    <div className='screen'>
      <div className='content-body send-body'>
        <h1 className='page-title'>Send ⓢ Sirch Coins</h1>
        
        <form className='send-form' onSubmit={handleSubmit}>
        
          <Autocomplete
            name='searchText'
            label='Recipient'
            placeholder="Partial name, email, or @handle..."
            inputValue={formData.selectedRecipient ? `${formData.selectedRecipient.full_name} (@${formData.selectedRecipient.user_handle})` : formData.searchText}
            onInputChange={handleSearchTextChange}
            selectedKey={formData.selectedRecipient?.user_id || null}
            onSelectionChange={(key) => {
              const user = foundUsers?.find(u => u.user_id === key);
              handleInputChange('selectedRecipient', user || null);
              if (user) {
                handleInputChange('searchText', '');
              }
            }}
            onClear={clearRecipient}
            items={foundUsers || []}
            isClearable
            variant="bordered"
            size="lg"
            radius="none"
            color="default"
            isInvalid={!!errors.recipient}
            errorMessage={errors.recipient}
            classNames={{
              base: "send-input mb-4",
              input: "text-white bg-black placeholder-gray-400",
              inputWrapper: "bg-black border-white data-[hover=true]:border-gray-300"
            }}
            listboxProps={{
              emptyContent: (formData.searchText.length !== 0 && foundUsers === null && formData.selectedRecipient === null) ? 
                <div className="flex items-center justify-center p-4">
                  <div className="loading-spinner spin-animation mr-2"></div>
                  <span>Searching for users...</span>
                </div> :
                formData.searchText.length !== 0 && foundUsers?.length === 0 ? 
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
              offset: 10
            }}
          >
            {(user) => (
              <AutocompleteItem key={user.user_id} value={user.user_id} className="bg-black text-white">
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold">{user.full_name}</div>
                    <div className="text-sm text-gray-400">@{user.user_handle}</div>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          <SirchNumberInput
            name='amountToSend'
            label='Amount'
            placeholder="How many ⓢ coins?"
            value={formData.amount}
            onChange={handleAmountChange}
            isRequired
            isInvalid={!!errors.amount || !!errors.balance}
            errorMessage={
              errors.amount ? "Please enter an amount" : 
              errors.balance ? `Insufficient balance. You have ⓢ ${userBalance || 0} available.` : 
              ""
            }
            min="1"
            max={userBalance?.toString() || "0"}
            step="1"
          />

          <SirchTextInput
            name='memo'
            label='Note (Optional; private among you)'
            placeholder="Leave a note?"
            value={formData.memo}
            onChange={handleMemoChange}
            maxLength={60}
          />

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

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        className="bg-black text-white border border-white"
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white border-b border-gray-700">
                <h2>Confirm Transaction</h2>
              </ModalHeader>
              <ModalBody className="text-white">
                <div className="space-y-4">
                  <p>Please confirm the following transaction details:</p>
                  <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipient:</span>
                      <span className="font-semibold">
                        {formData.selectedRecipient?.full_name} (@{formData.selectedRecipient?.user_handle})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-semibold text-green-400">ⓢ {formData.amount}</span>
                    </div>
                    {formData.memo && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Note:</span>
                        <span className="font-semibold">{formData.memo}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-gray-400">Your balance after:</span>
                      <span className="font-semibold">
                        ⓢ {userBalance ? (userBalance - parseFloat(formData.amount || '0')).toString() : '0'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone. Please verify all details are correct.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-700">
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="text-red-400 hover:bg-red-400/10"
                >
                  Cancel
                </Button>
                <Button 
                  color="success" 
                  onPress={handleConfirmSend}
                  isLoading={transferOperation.isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {transferOperation.isLoading ? "Sending..." : "Send Coins"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ToastNotification />
    </div>
  );
}
