import React, { useState } from 'react';
import { register } from '../app/authentication.js';
import logo from '../assets/logo-text.png';

function Register(props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const authenticate = async () => {
    document.getElementById("submitBtn").innerHTML = "Loading...";
    await register(username, name, password, confirmPassword);
    document.getElementById("submitBtn").innerHTML = "Submit";
  }
  
  return (
    <div id="authPage">
      <form style={{ display: 'block', height: '600px', margin: 'auto', textAlign: 'center' }} onSubmit={(e) => e.preventDefault()}>
      <img src={logo} style={{ width: '160px' }} ></img>
        <h1>Join &amp; Enjoy <i>(it's free!)</i></h1><br />
        <input id="usernameInput" type='text' placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}></input><br /><br />
        <input id="nameInput" type='text' placeholder="Add your creator name" onChange={(e) => setName(e.target.value)}></input><br /><br />
        <input id="passwordInput" type='password' placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}></input><br /><br />
        <input id="confirmPassword" type='password' placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}></input><br /><br />
        <button onClick={authenticate} id="submitBtn">Submit</button>
      </form>
    </div>
  );
}

export default Register;