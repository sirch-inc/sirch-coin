import LoginButton from "./components/Users/AuthLogin";
import LogoutButton from "./components/Users/AuthLogout";
import React, { useContext } from 'react';
import LogoutSupabase from "./components/Users/LogoutSupabase"
import { AuthContext } from "./components/Users/AuthContext";

export default function NavBar({ supabase }) {

  const { session } = useContext(AuthContext);

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
          {session ? (
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          ) : (
            <a href="/supabase-login">Login</a>
          )}
        </li>
      </ul>
    </>
  );
}
