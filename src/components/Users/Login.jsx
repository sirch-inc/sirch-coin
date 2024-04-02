import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const authResponse = await axios.post(
        "https://dev-rzyub0sbv728.us.auth0.com/oauth/token",
        {
          client_id: clientId,
          client_secret: clientSecret,
          audience: "https://useapi",
          grant_type: "client_credentials",
        },
        {
          headers: { "content-type": "application/json" },
        }
      );

      const accessToken = authResponse.data.access_token;
      console.log(accessToken);

      const userResponse = await axios.get(
        "http://localhost:5001/api/v1/customers/balance",
        {
          params: { email: email },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(userResponse.data); // This line will log the user response to the console

      // ... rest of the LoginPage component
    } catch (error) {
      console.error("Login error:", error.response || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleLogin}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
