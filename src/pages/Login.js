import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { login } from '../app/authentication.js';
import logo from '../assets/logo-text.png';

function Login(props) {
  const { t } = useTranslation();
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
        <h1>{t('Login_to_Pi_Webinars')}</h1><br />
        <input id="usernameInput" type='text' placeholder={t('Enter_username')} onChange={(e) => setUsername(e.target.value)}></input><br /><br />
        <input id="passwordInput" type='password' placeholder={t('Enter_password')} onChange={(e) => setPassword(e.target.value)}></input><br /><br />
        <button onClick={authenticate} id="submitBtn">{t('Submit')}</button>
      </form>
    </span>
  );
}

export default Login;