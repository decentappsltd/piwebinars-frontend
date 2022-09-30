import React, { useState } from 'react';
import { login } from '../app/authentication.js';
import logo from '../assets/logo-text.png';

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authenticate = async () => {
    document.getElementById("submitBtn").innerHTML = "Loading...";
    await login(username, password);
    props.toggle();
  }

  return (
    <span id="authPage">
      <form style={{ display: 'block', height: '600px', width: '400px', margin: 'auto', textAlign: 'center' }} onSubmit={(e) => e.preventDefault()}>
        <img src={logo} style={{ width: '160px' }} ></img>
        <h1>Login to Pi Webinars</h1><br />
        <input id="usernameInput" type='text' placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}></input><br /><br />
        <input id="passwordInput" type='password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}></input><br /><br />
        <button onClick={authenticate} id="submitBtn">Submit</button>
      </form>
    </span>
  );
}

export default Login;