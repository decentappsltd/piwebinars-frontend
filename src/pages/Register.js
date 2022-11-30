import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { register } from '../app/authentication.js';
import logo from '../assets/logo-text.png';

function Register(props) {
  const { t } = useTranslation();
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
        <h1>{t('Join_Enjoy')}</h1><br />
        <input id="usernameInput" type='text' placeholder={t('Enter_username')} onChange={(e) => setUsername(e.target.value)}></input><br /><br />
        <input id="nameInput" type='text' placeholder={t('Add_your_creator_name')} onChange={(e) => setName(e.target.value)}></input><br /><br />
        <input id="passwordInput" type='password' placeholder={t('Enter_password')} onChange={(e) => setPassword(e.target.value)}></input><br /><br />
        <input id="confirmPassword" type='password' placeholder={t('Confirm_password')} onChange={(e) => setConfirmPassword(e.target.value)}></input><br /><br />
        <button onClick={authenticate} id="submitBtn">{t('Submit')}</button>
      </form>
    </div>
  );
}

export default Register;