import { useContext } from 'react';
import { AuthContext } from './_common/AuthContext';


export default function NavBar() {
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
              <span>{userInTable && userBalance && (" " + userBalance + " / $ " + (userBalance*0.10).toFixed(2) + " USD")}</span>
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
