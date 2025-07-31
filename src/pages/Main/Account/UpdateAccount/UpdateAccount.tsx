import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button, Card, CardBody } from '@heroui/react';
import { SirchEmailInput, SirchTextInput, SirchPrivacyChip } from '../../../../components/HeroUIFormComponents';
import './UpdateAccount.css';


export default function UpdateAccount() {
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const userEmail = auth?.userEmail;
  const session = auth?.session;
  const [email, setEmail] = useState<string>(userEmail || '');
  const [isEmailPrivate, setIsEmailPrivate] = useState<boolean>(userInTable?.is_email_private ?? false);
  const [hasEmailChanged, setHasEmailChanged] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(userInTable?.first_name || '');
  const [lastName, setLastName] = useState<string>(userInTable?.last_name || '');
  const [isNamePrivate, setIsNamePrivate] = useState<boolean>(userInTable?.is_name_private ?? false);
  const [userHandle, setUserHandle] = useState<string>(userInTable?.user_handle || '');
  const navigate = useNavigate();

  // Update form state when userInTable data becomes available
  useEffect(() => {
    if (userInTable) {
      setFirstName(userInTable.first_name || '');
      setLastName(userInTable.last_name || '');
      setIsNamePrivate(userInTable.is_name_private ?? false);
      setUserHandle(userInTable.user_handle || '');
      setIsEmailPrivate(userInTable.is_email_private ?? false);
    }
  }, [userInTable]);

  // Update email state when userEmail becomes available
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: {
          full_name: firstName + ' ' + lastName,
          first_name: firstName,
          last_name: lastName,
          is_name_private: isNamePrivate,
          user_handle: userHandle,
          is_email_private: isEmailPrivate
        }
      });

      if (error) {
        if (isAuthApiError(error) || error.code === 'weak_password') {
          toast.error(error.message);
          return;
        }

        throw error;
      }

      toast.success("Account updated!");

      if (hasEmailChanged) {
        toast.success("A verification email was sent to your new email address.");
      }
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : String(exception));
      navigate('/error', { replace: true });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setHasEmailChanged(newEmail !== userEmail);
  };

  const handleSuggestNewHandle = async (): Promise<void> => {
    setUserHandle('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-valid-user-handles', {
        body: {
          handleCount: 1
        }
      });
    
      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No available user handles found.");
      }

      setUserHandle(data.handles[0]);
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : String(exception));
      navigate('/error', { replace: true });
    }
  };
  
  return (
    <div>
      <ToastNotification />

      {session ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-8">Update Account</h2>

          <form onSubmit={handleUpdate} autoComplete="off">
            <p>Update your account information below. Privacy settings control whether others can see your information.</p>
            
            <div className="flex items-center gap-4">
              <SirchEmailInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                isRequired
                className="flex-1"
              />
              <SirchPrivacyChip
                isPrivate={isEmailPrivate}
                onPrivacyChange={setIsEmailPrivate}
              />
            </div>

            {hasEmailChanged && (
              <Card className="bg-success-50 border-success-200">
                <CardBody>
                  <p className="text-success-600 text-sm">
                    Note: Changes to your email address will require email reverification.
                  </p>
                </CardBody>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <div className="flex gap-4 flex-1">
                <SirchTextInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <SirchTextInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <SirchPrivacyChip
                isPrivate={isNamePrivate}
                onPrivacyChange={setIsNamePrivate}
              />
            </div>

            <div className="flex items-center gap-4">
              <SirchTextInput
                label="Sirch User Phrase"
                value={userHandle}
                placeholder="Loading..."
                isReadOnly
                className="flex-1"
                classNames={{
                  input: "font-mono text-lg bg-default-50 !text-white"
                }}
                endContent={
                  <Button
                    size="sm"
                    variant="light"
                    onPress={handleSuggestNewHandle}
                    isDisabled={!userHandle}
                    className="text-xs"
                  >
                    ↺
                  </Button>
                }
              />
              <Button
                onPress={handleSuggestNewHandle}
                variant="bordered"
                size="lg"
                isDisabled={!userHandle}
              >
                Pick Another ↺
              </Button>
            </div>

            <div className='bottom-btn-container'>
              <Button
                type="submit"
                className='big-btn'
              >
                Update →
              </Button>

              <Button 
                className='big-btn' 
                onPress={() => { navigate(-1); }}
              >
                Back
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">You must be logged in to change your user account settings.</h3>
        </div>
      )}
    </div>
  );
}