import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutSupabase from '../Account/Logout';
import { AuthContext } from '../AuthContext';


export default function NavBar({ supabase }) {
  const { session } = useContext(AuthContext);
  const { userInTable, userBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout(){
    LogoutSupabase({ supabase })
    navigate('/')
  }
    
  return (
    <>
      <ul className='navbar'>
        <li className='navbar-item'>
          <a href='/'>
            <img
              src='/sirch-coin-favicon.ico'
              alt="Sirch Logo"
              // TODO: move this style into our CSS
              style={{ width: '60px', height: 'auto' }}
            />
          </a>
        </li>
        <li className='navbar-item'>
          <a href='/'>{userInTable?.user_handle}</a>
        </li>
      </ul>
    </>
  );
}
