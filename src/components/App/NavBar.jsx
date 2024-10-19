import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import LogoutSupabase from '../Account/Logout';
import { AuthContext } from '../AuthContext';


export default function NavBar({ supabase }) {
  // const { session } = useContext(AuthContext);
  const { userInTable, userBalance } = useContext(AuthContext);

  // TODO: remove this?
  // const navigate = useNavigate();

  // function handleLogout(){
  //   LogoutSupabase({ supabase })
  //   navigate('/')
  // }

  return (
    <nav>
      <ul className='navbar'>
        <li className='navbar-item'>
          <a href='/'>
            <div>
              <img
                src='/sirch-coin-favicon.ico'
                alt="Sirch Coins Logo"
                className='sirchcoins-logo'
              />
              <span>{userInTable && userBalance && (" " + userBalance?.balance)}</span>
            </div>
          </a>
        </li>
        <li className='navbar-item'>
          {userInTable && userInTable.full_name + " / @" + userInTable.user_handle}
        </li>
      </ul>
    </nav>
  );
}
