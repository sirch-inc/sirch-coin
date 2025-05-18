import { useContext } from 'react';
import { AuthContext } from '../../_common/AuthContext';
import './NavBar.css';


export default function NavBar() {
  const auth = useContext(AuthContext);

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
              <span>{auth?.userInTable && auth?.userBalance && (" " + auth.userBalance + " / $ " + (auth.userBalance*0.10).toFixed(2) + " USD")}</span>
            </div>
          </a>
        </li>
        <li className='navbar-item'>
          {auth?.userInTable && auth.userInTable.full_name + " / @" + auth.userInTable.user_handle}
        </li>
      </ul>
    </nav>
  );
}
