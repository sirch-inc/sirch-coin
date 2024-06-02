import React, { useContext } from 'react';
import LogoutSupabase from "./components/LogoutSupabase"
import { AuthContext } from "./components/AuthContext";

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
            <a href="supabase-login">Login</a>
          )}
        </li>
      </ul>
    </>
  );
}
