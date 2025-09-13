import { useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { ToastNotification, toast } from '../_common/ToastNotification';
import supabase from '../_common/supabaseProvider';
import useDebounce from '../../../helpers/debounce';
import { Button, AutocompleteItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { SirchNumberInput, SirchTextInput, SirchAutocomplete } from '../../../components/HeroUIFormComponents';
import { useFormValidation, useAsyncOperation } from '../../../hooks';
import 'react-toastify/dist/ReactToastify.css';
import './SendCoins.css';

interface User {
  user_id: string;
  user_handle: string;
  full_name: string;
}

// Form data types
interface ValidationErrors extends Record<string, boolean> {
  recipient: boolean;
  amount: boolean;
  balance: boolean;
}

interface SendCoinsFormData extends Record<string, unknown> {
  amount: string;
  searchText: string;
  memo: string;
  selectedRecipient: User | null;
}

export default function Send() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

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
      
      if (authContext?.userBalance && !isNaN(numAmount) && numAmount > authContext.userBalance) {
        return { isValid: false, message: `Insufficient balance. You have ⓢ ${authContext.userBalance} available.` };
      }
      return { isValid: true };
    },
    searchText: () => ({ isValid: true }), // Search text doesn't need validation
    memo: () => ({ isValid: true }) // Memo is optional
  }), [authContext?.userBalance]);

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  
  // Calculate if we should show the animated spacing
  const shouldShowDropdownSpacing = isDropdownOpen && !formData.selectedRecipient;
  
  // Measure the dropdown height when it opens or content changes
  useEffect(() => {
    if (shouldShowDropdownSpacing) {
      // Use a timeout to ensure the dropdown is fully rendered
      const timeoutId = setTimeout(() => {
        // Look for the dropdown element in the DOM using multiple possible selectors
        const dropdownElement = document.querySelector('[data-slot="listbox"]') || 
                               document.querySelector('[role="listbox"]') ||
                               document.querySelector('.bg-black.text-white.border.border-white') as HTMLElement;
        
        if (dropdownElement) {
          const rect = dropdownElement.getBoundingClientRect();
          // Add significant extra spacing to ensure no overlap with next field
          // The dropdown is absolutely positioned, so we need enough space for it + original field spacing
          setDropdownHeight(rect.height + 32); // Larger buffer to ensure proper spacing
        } else {
          // Fallback to a reasonable default if we can't find the dropdown
          setDropdownHeight(100); // Increased default to ensure no overlap
        }
      }, 100); // Slightly longer delay to ensure DOM is fully updated
      
      return () => clearTimeout(timeoutId);
    } else {
      setDropdownHeight(0);
      return undefined;
    }
  }, [shouldShowDropdownSpacing, foundUsers, formData.searchText]);

  const fetchUserBalance = useCallback(async () => {
    if (authContext?.refreshUserBalance) {
      await authContext.refreshUserBalance();
    }
  }, [authContext]);

  const debouncedLookupUsers = useDebounce(async () => {
    if (!formData.searchText || formData.selectedRecipient) return;

    await userLookupOperation.execute(
      async () => {
        const { data: foundUsersData, error: foundUsersError } = await supabase.functions.invoke('lookup-user', {
          body: { searchText: formData.searchText }
        });

        if (foundUsersError) {
          throw new Error("Unable to look up users at this time. Please try again later.");
        }

        const newFoundUsers = foundUsersData.found as User[];
        setFoundUsers(newFoundUsers);

        // Auto-select if exactly one user found
        if (newFoundUsers.length === 1) {
          handleInputChange('selectedRecipient', newFoundUsers[0]);
        }

        return newFoundUsers;
      },
      {
        suppressErrorToast: false
      }
    );
  });

  // Enhanced input handlers
  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    const validAmount = parseFloat(amount) < 0 ? '' : amount;
    handleInputChange('amount', validAmount);
    
    // Also validate balance in real-time
    if (validAmount && authContext?.userBalance) {
      const parsedAmount = parseFloat(validAmount);
      if (parsedAmount > authContext.userBalance) {
        // This will be caught by the balance validation rule
      }
    }
  }, [handleInputChange, authContext?.userBalance]);

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
    const userInTable = authContext?.userInTable;
    const userBalance = authContext?.userBalance;
    
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
        toast.success(`Successfully sent ⓢ ${amount} Sirch Coins to ${recipient.full_name}!`);
        navigate('/');
      }
    );
  }, [formData, authContext, transferOperation, resetForm, fetchUserBalance, navigate]);

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

  // Focus on confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      // Use setTimeout to ensure the modal is fully rendered
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!authContext) {
    navigate('/');
    return null;
  }

  return (  
    <>
      <ToastNotification />

      <div>
        <h2>Send ⓢ</h2>

        <form onSubmit={handleSubmit} noValidate>
          <p>You can send Sirch Coins to your friends or others here.</p>
          <p>Please enter some details to help us identify the recipient, the amount, and an optional private note.</p>
        
          <div 
            className="autocomplete-spacing"
            style={{
              marginBottom: dropdownHeight,
              transition: 'margin-bottom 0.25s ease-in-out'
            }}
          >
            <SirchAutocomplete
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
              onOpenChange={(isOpen) => {
                setIsDropdownOpen(isOpen);
              }}
              items={foundUsers || []}
              isRequired
              isInvalid={errors.recipient}
              errorMessage={getFieldError('recipient')}
              endContent={
                (formData.selectedRecipient || formData.searchText) ? (
                  <button
                    type="button"
                    onClick={clearRecipient}
                    className="bg-black text-white hover:bg-gray-800 hover:text-gray-300 p-1 z-10 rounded"
                    aria-label="Clear"
                  >
                    ✕
                  </button>
                ) : null
              }
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
                offset: 2
              }}
            >
              {(item: object) => {
                const user = item as User;
                return (
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
                );
              }}
            </SirchAutocomplete>
          </div>

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
              errors.balance ? `Insufficient balance. You have ⓢ ${authContext?.userBalance || 0} available.` : 
              ""
            }
            min="1"
            max={authContext?.userBalance?.toString() || "0"}
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
                        ⓢ {authContext?.userBalance ? (authContext.userBalance - parseFloat(formData.amount || '0')).toString() : '0'}
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
                  ref={confirmButtonRef}
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