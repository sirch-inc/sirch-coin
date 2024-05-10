import LoginButton from "./components/Users/AuthLogin";
import LogoutButton from "./components/Users/AuthLogout";

export default function NavBar() {
  return (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <a href="/">
            <img
              src="/sirch_logo.png"
              alt="Sirc Logo"
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
          <a href="/logout">Logout</a>
        </li>
      </ul>
    </>
  );
}
