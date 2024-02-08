import React, { useState } from 'react';


const LoginButton = () => {
  const [idToken, setIdToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginEndpoint = 'https://backend.sirchengine.org/login/';

  const login = async () => {
    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Identifier': 'sirchcoin',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { id_token } = data;

      setIdToken(id_token);

    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={login}>Login</button>
      {idToken && <p>id_token: {idToken}</p>}
    </div>
  );
};


export default LoginButton;

