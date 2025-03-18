import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Check if the user is already authenticated
    axios
      .get('http://localhost:5001/auth/login/success', { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        setErrorMessage('Not authenticated');
      });
  }, []);

  const handleLogin = () => {
    // Redirect to the backend Google authentication route
    window.location.href = 'http://localhost:5001/auth/google';
  };

  const handleLogout = () => {
    axios
      .get('http://localhost:5001/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        setErrorMessage('Logout failed');
      });
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <img src={user.photos[0].value} alt="profile" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Login with Google</h1>
          {errorMessage && <p>{errorMessage}</p>}
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
};

export default Login;
