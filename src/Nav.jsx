import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutSupabase from "./components/Account/Logout"
import { AuthContext } from "./components/AuthContext";


// eslint-disable-next-line react/prop-types
export default function NavBar({ supabase }) {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout(){
    LogoutSupabase({ supabase })
    navigate('/')
  }
    
  return (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <a href="/">
            <img
              src="/sirch_logo.png"
              alt="Sirch Logo"
              // TODO: move this style into our CSS
              style={{ width: "60px", height: "auto" }}
            />
          </a>
        </li>
        <li className="navbar-item">
          <a href="/">Sirch Coin</a>
        </li>
        <li>
          {session ? (
            <ul className='navbar-links'>
              <li>
                <a href='/account'>My Account </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          ) : (
            <>
              <ul className='navbar-links'>
                <li>
                  <a href="login">Login</a>
                </li>
                <li>
                  <a href="create-account">Create an Account</a>
                </li>
              </ul>
            </>
          )}
        </li>
      </ul>
    </>
  );
}
