import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import supabase from '../App/supabaseConfig';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setSignInError(true);

        // TODO: hack to get around lint
        console.log("Data", data);

        throw error;
      }

      navigate("/");
    } catch (exception) {
      // TODO: Add login failure notification to user

      console.error("Error logging in:", exception.message);
    }
  };
  
  return (
    <AuthContext.Consumer>
      {({ session }) =>
        !session &&
          !signInError ? (
          <>
          <h2>Log In</h2>
          <p> New users should <a href="/create-account">create an account</a> first.</p>
          <form onSubmit={handleLogin}>
            <input
              className="account-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <input
              className="account-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button className="account-button" type="submit">Log In →</button>
            <a href="/forgot-password">Forgot Password?</a>
          </form>
          </>
        ) : (
          <div>
            <h2>Log In</h2>
            <p>New users should <a href="/create-account">create an account</a> first.</p>
            <form onSubmit={handleLogin} autoComplete="off">
            <input
              className="account-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="account-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <button className="account-button" type="submit">Log In →</button>
            <a href="/forgot-password">Forgot Password?</a>
          </form>
          <div>
            <p style={{ color: "red" }}>There was an issue with your credentials. Please try logging in again.</p>
          </div>
          </div>
        )
      }
    </AuthContext.Consumer>
    );
  }