import { useContext } from 'react';
import { AuthContext } from '../AuthContext';


export default function NavBar({ supabase }) {
  const { userInTable, userBalance } = useContext(AuthContext);

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
              <span>{userInTable && userBalance && (" " + userBalance + " / $ " + (userBalance*0.10).toFixed(2))}</span>
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
