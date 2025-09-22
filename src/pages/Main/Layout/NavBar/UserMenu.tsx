import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  User 
} from '@heroui/react';

export default function UserMenu() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/error', { replace: true });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!auth?.userInTable) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="bordered"
          color="success"
          onPress={() => navigate('/login')}
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
        >
          Login
        </Button>
        <Button
          color="success"
          onPress={() => navigate('/create-account')}
          className="bg-green-500 text-black hover:bg-green-600"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="p-2 bg-transparent data-[hover=true]:bg-transparent text-white hover:text-green-500 min-h-16"
          endContent={<span className="text-sm">▼</span>}
        >
          <User
            name={auth.userInTable.full_name}
            description={`@${auth.userInTable.user_handle}`}
            classNames={{
              base: "py-2",
              name: "text-white text-lg leading-relaxed",
              description: "text-gray-400 text-sm leading-relaxed pb-1"
            }}
            avatarProps={{
              size: "sm",
              className: "bg-green-500 text-black"
            }}
          />
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu 
        aria-label="User menu actions"
        className="bg-gray-900 border border-gray-700"
        itemClasses={{
          base: "text-white hover:bg-gray-800 hover:text-green-500"
        }}
      >
        <DropdownItem
          key="profile"
          onPress={() => handleNavigation('/my-account')}
        >
          Manage Account
        </DropdownItem>

        <DropdownItem
          key="logout"
          className="text-red-400 hover:text-red-300"
          color="danger"
          onPress={handleLogout}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}