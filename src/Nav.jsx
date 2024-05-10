import LoginButton from "./components/Users/AuthLogin";
import LogoutButton from "./components/Users/AuthLogout";
import LogoutSupabase from "./components/Users/LogoutSupabase"

export default function NavBar({ supabase }) {

  function handleLogout(){
    LogoutSupabase({ supabase })
    }

  return (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <a href="/">
            <img
              src="/sirch_logo.png"
              alt="Sirch Logo"
              style={{ width: "60px", height: "auto" }}
            />
          </a>
        </li>
        <li className="navbar-item">
          <a href="/"> SirchCoin </a>
        </li>
        <li>
          {/* <LoginButton/> */}
          <a href="/supabase-login">Login</a>
          {/* <LogoutButton/> */}
          <a href="#" onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </>
  );
}
