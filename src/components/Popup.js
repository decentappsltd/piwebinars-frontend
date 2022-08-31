import React from 'react';

function AuthPopup() {  
  const authenticate = async () => {    
    if (this.props.type == 'login') {
      let username = document.querySelector("#pi_username").value;
      let password = document.querySelector("#user_password").value;
      let uid = localStorage.uid;

      try {
        if (username === "" || password === "") {
          const message = "Cannot send empty fields!!!";
          flashMessage = message;
        } else {
          const user = {
            username,
            password,
            uid
          };
          const response = await instance.post(`/login`, user);
          if (response.status === 200) {
            const message = "User successfully logged in !!!";
            token = response.data.token;
            instance.defaults.headers.common["Authorization"] = token;
            sessionStorage.removeItem("userSession");
            localStorage.removeItem("userSession");
            sessionStorage.setItem("userSession", token);
            localStorage.setItem("userSession", token);
            sessionStorage.setItem("username", username);
            flashMessage = message;
            window.location.href = "/";
          }
          username = "";
          password = "";
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage.length > 0) flashMessage = errorMessage;
      }
 
      flashBool = true;

      // Flash message
      if (flashBool && flashMessage.length > 0) {
        pTag.textContent = flashMessage;
        errorFlash.appendChild(pTag);
        setTimeout(() => {
          flashMessage = "";
          flashBool = false;
          errorFlash.removeChild(pTag);
        }, flashTime);
      }
    }
    
    if (this.props.type == 'register') {
      const fullName = document.querySelector("#full_name").value;
      const username = document.querySelector("#pi_username").value;
      let password = document.querySelector("#user_password").value;
      let confirmPassword = document.querySelector("#confirm_password").value;
      const referral = document.querySelector("#referral").value;

      try {
        if ((fullName || username || password || confirmPassword) === "") {
          const message = "Cannot send empty fields!!!";
          flashMessage = message;
        } else if (confirmPassword !== password) {
          const message = "Passwords do not match";
          flashMessage = message;
        } else if (password.length < 8) {
          const message = "Passwords must be greater or equal to 8 characters";
          flashMessage = message;
        } else {
          const newUser = {
            name: fullName,
            username,
            password,
            referral
          };
          const response = await instance.post(`/register`, newUser);
          if (response.status === 201) {
            flashMessage = `New User successfully register!!!`;
            flashBool = true;
            setTimeout(() => {
              window.location.href = "/html/login.html";
            }, 3000);
          }
          password = "";
          confirmPassword = "";
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage.length > 0) flashMessage = errorMessage;
      }
      flashBool = true;

      // Flash message
      if (flashBool && flashMessage.length > 0) {
        pTag.textContent = flashMessage;
        errorFlash.appendChild(pTag);
        setTimeout(() => {
          flashMessage = "";
          flashBool = false;
          errorFlash.removeChild(pTag);
        }, flashTime);
      }
    }
  };
  
  return (
      <div className="popup">
        <h2>{this.props.header}</h2>
        <a onClick={this.props.closePopup}>x</a>
        <form>
          <input id="usernameInput" placeholder="Enter username"></input>
          { this.props.type == "register" && <input id="nameInput" placeholder="Add your name"></input> }
          <input id="passwordInput" placeholder="Enter password"></input>
          { this.props.type == "register" && <input id="confirmPassword" placeholder="Confirm password"></input> }
          <button onClick={authenticate}></button>
        </form>
      </div>
  );
}

export default AuthPopup;