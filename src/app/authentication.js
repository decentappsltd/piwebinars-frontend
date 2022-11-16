import axios from 'axios';

const registerBtn = document.querySelector("#register");
const uploadBtn = document.querySelector("#upload_btn");
const loginBtn = document.querySelector("#login");
const createUserProfile = document.querySelector("#create_profile");
const handleBtn = document.querySelector("#handle");
const logoutBtn = document.querySelector("#logout");
const logoutAllBtn = document.querySelector("#logoutAll");
const deleteAccountBtn = document.querySelector("#deleteAccount");
const errorFlash = document.querySelector("#error_log");
const followBtn = document.querySelector("#follow_btn");
const searchBtn = document.querySelector("#search_btn");
const searchDisplay = document.querySelector("#searchedUser");
const commentsDisplay = document.querySelector("#commentsContainer");
const authNavv = document.querySelectorAll(".authNav");
const unAuthNavv = document.querySelectorAll(".unAuthNav");

//saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

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
  baseURL: "https://piwebinars-server.onrender.com",
  // baseURL: "http://localhost:5000",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken}`
  },
  withCredentials: true,
  credentials: "same-origin"
});

// Dark mode
if (localStorage.dark == "true") {
  document.getElementById("dark").setAttribute("href", "/css/dark.css");
}

function darkMode() {
  if (localStorage.dark == "true") {
    localStorage.dark = "false";
  } else {
    localStorage.dark = "true";
  }
  if (localStorage.dark == "true") {
    document.getElementById("dark").setAttribute("href", "/css/dark.css");
    document.getElementById("darkOn").style.display = "inline-block";
    document.getElementById("darkOff").style.display = "none";
  } else {
    document.getElementById("dark").setAttribute("href", "");
    document.getElementById("darkOn").style.display = "none";
    document.getElementById("darkOff").style.display = "inline-block";
  }
}

// saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

// Login a user
async function login(username, password) {
  let uid = localStorage.uid;
  try {
    if ((username || password) === "") {
      alert("Please enter both fields");
    } else {
      const user = {
        username,
        password,
        uid
      };
      const response = await instance.post(`/login`, user);
      if (response.status === 200) {
        console.log(response);
        // alert(`Welcome back, ${username}!`);
        token = response.data.token;
        instance.defaults.headers.common["Authorization"] = token;
        sessionStorage.removeItem("userSession");
        localStorage.removeItem("userSession");
        sessionStorage.setItem("userSession", token);
        localStorage.setItem("userSession", token);
        sessionStorage.setItem("username", username);
        localStorage.setItem("username", username);
        localStorage.setItem("user", response.data.userId);
        sessionStorage.setObj("profile", response.data.profile);
        window.dispatchEvent(new Event("storage"));
        window.location.pathname = '/';
        return username;
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) alert(errorMessage);
  }
}

// Register a new user
async function register(
  username,
  fullName,
  password,
  confirmPassword,
  referral
) {
  try {
    if ((fullName || username || password || confirmPassword) === "") {
      alert("Please enter all required fields");
    } else if (confirmPassword !== password) {
      alert("Passwords do not match");
    } else if (password.length < 8) {
      alert("Passwords must be greater or equal to 8 characters");
    } else {
      const newUser = {
        name: fullName,
        username,
        password,
        referral
      };
      const response = await instance.post(`/register`, newUser);
      if (response.status === 201) {
        alert(`Welcome to Pi Webinars ${fullName}. Now please login.`);
        window.location.href = "/login";
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) alert(errorMessage);
  }
}

// Get profile
async function myProfile() {
  const authTkn = localStorage.userSession;
  const response = await instance.get("/profile", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTkn}`
    }
  });
  console.log(response);
  return response.data.profile;
}

// Get user
async function getProfile(user_id) {
  const response = await instance.get(`/profile/user/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log(response);
  return response.data.profile;
}

// Edit handle
async function editProfile(currentHandle) {
  const handle = prompt("Enter new name", `${currentHandle}`);
  const authToken = localStorage.getItem("userSession");
  if (handle === "" || handle === null) {
    alert("Handle cannot be null");
  } else if (handle !== currentHandle) {
    const userHandle = {
      handle
    };
    const response = await instance.post(`/profile`, userHandle, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      }
    });
    if (response.status === 200) {
      alert("Profile updated!");
    } else {
      alert("Handle is taken");
    }
  }
}

// Upload webinar
async function upload(fileType, title, description, price, category) {
  const formSection = document.getElementById("form");
  const errorFlash = document.querySelector("#upload_log");
  const video = document.querySelector("#videoUpload");
  const thumbnail = document.querySelector("#thumbnailUpload");
  let certify_btn = document.querySelector("#certify");
  if (certify_btn.checked == true) {
    // document.getElementById("submitBtn").style.display = "none";
    const authToken = localStorage.getItem("userSession");
    const formData = new FormData(formSection);
    console.log(formData);
    formData.append("category", category);

    if ((title || description) === "" || video === null)
      return "Unable to process.";
    else {
      try {
        let message = `Preparing your upload . . .`;
        pTag.textContent = message;
        errorFlash.appendChild(pTag);
        flashBool = true;
        const config = {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            let message = `Uploading your webinar . . . ${percentCompleted}%`;
            if (percentCompleted === 100)
              message = "Please wait, verifying your upload . . .";
            pTag.textContent = message;
            errorFlash.appendChild(pTag);
            flashBool = true;
          }
        };
        const response = await instance.post(
          `/upload/file_upload`,
          formData,
          config,
          {
            headers: {
              "Content-Type":
                "multipart/form-data; boundary='--sampleBoundary'",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${authToken}`
            },
            withCredentials: true,
            credentials: "same-origin"
          }
        );
        if (response.status === 200) {
          const message = "Successfully uploaded your webinar !!!";
          flashMessage = message;
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
        }, 120000);
      }
    }
  }
}

// Log user out current session
async function logout() {
  const authToken = localStorage.getItem("userSession");

  try {
    if (authToken === null) {
      alert("No user is authenticated, please login!!!");
    } else {
      const response = await instance.post(`/logout`).catch((error) => {
        console.log(error);
        localStorage.clear();
        sessionStorage.clear();
        window.location.pathname = "/";
      });
      if (response.status === 200) {
        delete instance.defaults.headers.common["Authorization"];
        sessionStorage.clear();
        localStorage.clear();
        window.location.pathname = "/";
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    console.log(errorMessage);
  }
}

// Log out all other sessions except current session
async function logoutAll() {
  const authToken = localStorage.getItem("userSession");

  try {
    if (authToken === null) {
      alert("No user is authenticated, please login!!!");
    } else {
      const response = await instance.post(`/logout/logout_all`);
      if (response.status === 200) {
        alert("Logged out all other devices.");
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    console.log(errorMessage);
  }
}

// Delete account
async function deleteAccount() {
  const confirmMessage = window.confirm(
    "Are you sure you want to delete your account? This CANNOT be undone!!!"
  );
  if (!confirmMessage) return false;
  else {
    try {
      const authToken = localStorage.getItem("userSession");
      if (authToken === null) {
        alert("No user is authenticated, please login!!!");
      } else {
        const response = await instance.delete(`/profile`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${authToken}`
          },
          withCredentials: true,
          credentials: "same-origin"
        });
        if (response.status === 200) {
          alert(`You have successfully deleted your account!!!`);
          delete instance.defaults.headers.common["Authorization"];
          sessionStorage.removeItem("userSession");
          localStorage.removeItem("userSession");
        }
      }
    } catch (error) {
      alert("Please login or register");
      const errorMessage = error.response.data.message;
      console.log(errorMessage);
    }
  }
}

// Follow or Unfollow a user
async function followUnfollow(user_id) {
  try {
    const authTkn = localStorage.userSession;
    const response = await instance.post(
      `/profile/auth_follow_unfollow/${user_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${authTkn}`
        },
        withCredentials: true,
        credentials: "same-origin"
      }
    );
    if (response.status === 200) {
      console.log(response);
      if (response.data.Unfollowed) return 'Follow';
      else return 'Unfollow';
    }
  } catch (error) {
    return "Please login";
    console.error(error);
  }
}

async function addAvatar() {
  const authTkn = localStorage.userSession;
  const email = prompt("Please enter your email to find your Gravatar (we do not store or share your email address)");
  if (email) {
    const response = await instance.post("/profile/avatar", { email }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTkn}`
      }
    }).catch(err => console.error(err));
    alert(response.data.message);
  }
}

const manipulateComment = async (url_path, api, user_id, post_id, comment_id, body) => {
  const authTkn = localStorage.userSession;
  const response = await instance[api](
    `/post/${url_path}/${user_id}/${post_id}/${comment_id}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authTkn}`
      },
      withCredentials: true,
      credentials: "same-origin"
    }
  ).catch((error) => {
    alert("Please login or register");
  });
  if (response.status === 200) {
    return "Success";
  }
};

export {
  login,
  register,
  upload,
  myProfile,
  getProfile,
  editProfile,
  logout,
  logoutAll,
  deleteAccount,
  followUnfollow,
  addAvatar,
  manipulateComment
};