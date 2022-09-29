import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchValue } from '../atoms/forms.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { search, filter, addWishlist } from '../app/webinars.js';
import { login, register } from '../app/authentication.js';
import { Search } from './Bar.js';

function AuthPopup(props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authenticate = async () => {
    if (props.type == "login") {
      await login(username, password);
      props.toggle();
    } else {
      const response = await register(
        username,
        name,
        password,
        confirmPassword
      );
      props.toggle();
    }
  };

  const setClickEvent = () => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        document.removeEventListener('click', close);
        props.close();
      }
    }
    document.addEventListener('click', close);
  }
  
  useEffect(() => {
    setTimeout(setClickEvent, 500);
  }, []);

  return (
    <div className="popup">
      <h2>{props.header}</h2>
      <a onClick={props.close}>x</a>
      <input
        id="usernameInput"
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <br />
      {props.type == "register" && (
        <>
          <input
            id="nameInput"
            placeholder="Add your name"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <br />
        </>
      )}
      <input
        id="passwordInput"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <br />
      {props.type == "register" && (
        <>
          <input
            id="confirmPassword"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <br />
        </>
      )}
      <p onClick={authenticate}>submit</p>
    </div>
  );
}

function User(props) {
  const [modalShown, toggleModal] = useState(false);

  return (
    <div>
      <div
        id={props.type}
        onClick={() => {
          toggleModal(!modalShown);
        }}
      >
        <i className={props.class}></i>
      </div>
      {modalShown ? (
        <AuthPopup
          header={props.label}
          type={props.type}
          toggle={() => {
            props.toggle();
          }}
          close={() => {
            toggleModal(!modalShown);
          }}
        />
      ) : null}
    </div>
  );
}

function BarMobile() {
  const [authed, setAuth] = useState(false);

  useEffect(() => {
    if (sessionStorage.userSession) setAuth(true);
    else setAuth(false);
  }, []);
  
  function close(e) {
    if (!document.querySelector("#nav").contains(e.target)) {
      document.querySelector("#nav").style.width = "0px";
      document.querySelector("#tint").style.display = "none";
      document.removeEventListener("click", close);
    }
  }
  
  const listener = () => {
    document.addEventListener("click", close);
  }
  
  const openNav = () => {
    document.getElementById("nav").style.width = "250px";
    document.querySelector("#tint").style.display = "block";
    const myTimeout = setTimeout(listener, 600);
  }

  return (
    <>
      <span id="bar">
        <i className="fas fa-bars" id="openNav" onClick={openNav}></i>
        <Search class={( authed ? 'expandedSearch' : 'smallSearch' )} />
        {authed === true ? null : (
          <>
            <User
              toggle={() => {
                setAuth(true);
              }}
              type="register"
              class="fas fa-user-plus userLoginIcon"
            />
            <User
              toggle={() => {
                setAuth(true);
              }}
              type="login"
              class="fas fa-user userLoginIcon"
            />
          </>
        )}
      </span>
    </>
  );
}

export default BarMobile;
