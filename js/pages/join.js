const formSection = document.querySelector("#form");
const registerBtn = document.querySelector("#register");
const uploadBtn = document.querySelector("#upload_btn");
const loginBtn = document.querySelector("#login");
const loginFirstBtn = document.querySelector("#firstLogin");
const createUserProfile = document.querySelector("#create_profile");
const handleBtn = document.querySelector("#handle");
const logoutBtn = document.querySelector("#logout");
const logoutAllBtn = document.querySelector("#logoutAll");
const deleteAccountBtn = document.querySelector("#deleteAccount");
const errorFlash = document.querySelector("#error_log");

// Variables
let token;
let flashMessage = "";
let flashBool = false;
const flashTime = 3000;
const pTag = document.createElement("p");
const pTag2 = document.createElement("p");
const imgTag = document.createElement("img");
const linkDom = document.createElement("a");
const divDom = document.createElement("div");
const authToken = localStorage.getItem("userSession");
const sessToken = sessionStorage.getItem("userSession");
const instance = axios.create({
  baseURL: "https://piwebinars-server.herokuapp.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken}`,
  },
  withCredentials: true,
  credentials: "same-origin",
});

// Register a new user
if (registerBtn !== null) {
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const fullName = document.querySelector("#full_name").value;
    const username = document.querySelector("#pi_username").value;
    let password = document.querySelector("#user_password").value;
    let confirmPassword = document.querySelector("#confirm_password").value;

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
        };
        const response = await instance.post(`/register`, newUser);
        if (response.status === 201) {
          flashMessage = `New User successfully register!!!`;
          flashBool = true;
          setTimeout(() => {
            document.getElementById("firstLoginModal").classList.add("cinema-visible");
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
  });
}

//first login to create a new profile automatically
if (loginFirstBtn !== null) {
  loginFirstBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let username = document.querySelector("#pi_username").value;
    let password = document.querySelector("#user_password").value;
    let handle = document.querySelector("#pi_username").value;

    try {
      if ((username || password) === "") {
        const message = "Cannot send empty fields!!!";
        flashMessage = message;
      } else {
        const user = {
          username,
          password,
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
          localStorage.setItem("name", username);
          flashMessage = message;
        }
        username = "";
        password = "";
        //create new profile
        createProfile(handle);
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
  });
}

// Create a user profile
async function createProfile(handle) {
    const authToken = localStorage.getItem("userSession");

    try {
      if (handle === "") {
        const message = "Cannot send empty fields!!!";
        flashMessage = message;
      } else {
        const userHandle = {
          handle,
        };
        const responseProfile = await instance.post(`/profile`, userHandle, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (responseProfile.status === 200) {
          const message = "User Profile was successfully created !!!";
          flashMessage = message;
          window.location.href = "/";
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage.length > 0) flashMessage = errorMessage;
    }

    flashBool = true;
    handle.textContent = "";

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