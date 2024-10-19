import React from 'react';
import './Login.scss'; 

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p>Enter your username or NIK and password to login.</p>
        <form>
          <div className="form-group">
            <label htmlFor="username">NIK or Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter NIK or username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="login-btn-container">
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;


