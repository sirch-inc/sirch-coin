import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button, Spacer, Card, CardBody } from '@heroui/react';
import { SirchEmailInput, SirchTextInput, SirchSwitch } from '../../../../components/HeroUIFormComponents';
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
    <div className="update-account-container">
      <ToastNotification />

      {session ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-8">Update Account</h2>

          <form onSubmit={handleUpdate} autoComplete="off">
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <SirchEmailInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  isRequired
                  className="flex-1"
                />
                <SirchSwitch
                  isSelected={isEmailPrivate}
                  onValueChange={setIsEmailPrivate}
                >
                  Private
                </SirchSwitch>
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

              <Spacer y={2} />

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
                <SirchSwitch
                  isSelected={isNamePrivate}
                  onValueChange={setIsNamePrivate}
                >
                  Private
                </SirchSwitch>
              </div>

              <Spacer y={2} />

              <div className="flex items-center gap-4">
                <div className="min-w-fit">
                  <p className="text-sm font-medium">Sirch User Phrase:</p>
                </div>
                <SirchTextInput
                  value={userHandle}
                  placeholder="Loading..."
                  isReadOnly
                  className="flex-1"
                />
                <Button
                  onPress={handleSuggestNewHandle}
                  variant="bordered"
                  size="lg"
                >
                  Pick Another ↺
                </Button>
              </div>

              <Spacer y={4} />

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
              >
                Update →
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">You must be logged in to change your user account settings.</h3>
        </div>
      )}

      <div className="text-center mt-8">
        <Button 
          variant="bordered"
          size="lg"
          onPress={() => { navigate(-1); }}>
          Back
        </Button>
      </div>
    </div>
  );
}