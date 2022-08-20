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
  baseURL: "https://piwebinarsdev.herokuapp.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken}`,
  },
  withCredentials: true,
  credentials: "same-origin",
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
          uid,
        };
        const response = await instance.post(`/login`, user);
        if (response.status === 200) {
          console.log(response);
          alert("User successfully logged in !!!");
          token = response.data.token;
          instance.defaults.headers.common["Authorization"] = token;
          sessionStorage.removeItem("userSession");
          localStorage.removeItem("userSession");
          sessionStorage.setItem("userSession", token);
          localStorage.setItem("userSession", token);
          sessionStorage.setItem("username", username);
          localStorage.setItem("username", username);
          return username;
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage.length > 0) alert(errorMessage);
    }
}

// Register a new user
async function register(username, fullName, password, confirmPassword, referral) {
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
          referral,
        };
        const response = await instance.post(`/register`, newUser);
        if (response.status === 201) {
          alert(`Welcome to Pi Webinars ${fullName}. Now please login.`);
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage.length > 0) flashMessage = errorMessage;
    }
}

// Get profile 
async function myProfile() {
  const authTkn = localStorage.userSession;
  const response = await instance.get('/profile', {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTkn}`,
    },
  });
  console.log(response);
  return response.data.profile;
}

// Get user 
async function getProfile(user_id) {
  const response = await instance.get(`/profile/user/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log(response);
  return response.data.profile;
}

// Edit handle
async function editProfile() {
  const handle = prompt("Enter new handle", "");
  const authToken = localStorage.getItem("userSession");
  if (handle === "" || handle === null) {
    alert("Handle cannot be null");
  } else {
    const userHandle = {
      handle,
    };
    const response = await instance.post(`/profile`, userHandle, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.status === 200) {
      alert("Profile update!");
      window.location.href = "/html/profile.html";
    } else if (response.status === 201) {
      alert("Entered name is the same as your existing name");
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
    document.getElementById("submitBtn").style.display = "none";
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
          },
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
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
            credentials: "same-origin",
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
        const response = await instance.post(`/logout`);
        if (response.status === 200) {
          delete instance.defaults.headers.common["Authorization"];
          sessionStorage.removeItem("userSession");
          localStorage.removeItem("userSession");
          localStorage.removeItem("currentUser");
          alert("Successfully logged out!");
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
    const confirmMessage = confirm(
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
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
            credentials: "same-origin",
          });
          if (response.status === 200) {
            alert(`You have successfully deleted your account!!!`);
            delete instance.defaults.headers.common["Authorization"];
            sessionStorage.removeItem("userSession");
            localStorage.removeItem("userSession");
          }
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      }
    }
}

// Search for a user
if (searchBtn !== null) {
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchName = document.querySelector("#search_user").value.trim();

    try {
      if (searchName === "") {
        const message = "Cannot search empty fields!!!";
        flashMessage = message;
      } else {
        const response = await instance.get(`/profile/handle/${searchName}`, {
          params: {
            handle: searchName,
          },
        });
        if (response.status === 200) {
          // localStorage.setItem("userProfileName", searchName);
          const {
            handle,
            user: { name: user_name, _id: userId },
          } = response.data.profile;
          localStorage.setItem("user_id", userId);

          pTag.setAttribute("class", "searched_user_name");
          pTag2.setAttribute("class", "searched_user_handle");
          pTag.textContent = user_name;
          pTag2.textContent = `@${handle}`;
          imgTag.src = "../../img/avatar.png";
          imgTag.setAttribute("class", "searched_user_avatar");
          linkDom.setAttribute("href", `/html/userProfile.html`);
          linkDom.setAttribute("class", `searchedUserLink`);
          divDom.setAttribute("class", "name_section");
          divDom.appendChild(pTag);
          divDom.appendChild(pTag2);
          linkDom.appendChild(imgTag);
          linkDom.appendChild(divDom);
          searchDisplay.appendChild(linkDom);
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage && errorMessage.length > 0) flashMessage = errorMessage;
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

// Create profile from profile
if (createUserProfile !== null) {
  document.querySelector(".stats").style.display = "none";
}

// Follow or Unfollow a user
if (followBtn !== null) {
  followBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let user_id = localStorage.user_id;

    try {
      const response = await instance.post(
        `/profile/auth_follow_unfollow/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
          credentials: "same-origin",
        }
      );
      if (response.status === 200) {
        const profile = await instance.get(`/profile`);
        if (profile.status === 200)
          localStorage.setObj("following", profile.data.profile.following);
        window.location.reload();
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      return errorMessage;
    }
  });
}

  const likeComments = document.querySelectorAll(".likeComment");
  const editComments = document.querySelectorAll(".editComment");
  const replyComments = document.querySelectorAll(".replyComment");
  const deleteComments = document.querySelectorAll(".deleteComment");

  const manipulateComment = (comment, url_path, api) => {
    return comment.addEventListener("click", async (e) => {
      const user_id = localStorage.getItem("user_id");
      const post_id = localStorage.getItem("post_id");
      const comment_id = e.target.dataset.comment_id;

      try {
        const response = await instance[api](
          `/post/${url_path}/${user_id}/${post_id}/${comment_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
            credentials: "same-origin",
          }
        );
        if (response.status === 200) {
          window.location.reload();
          return "Success";
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        return errorMessage;
      }
    });
  };

  const manipulateEdits = (comment, api) => {
    const editCommentModal = document.querySelector("#editCommentModal");
    const editCommentInputLabel = document.querySelector(
      "#editCommentInputLabel"
    );
    return comment.addEventListener("click", async (e) => {
      editCommentModal.style.display = "flex";
      const user_id = localStorage.getItem("user_id");
      const post_id = localStorage.getItem("post_id");
      const comment_id = e.target.dataset.comment_id;
      const editCommentBtn = document.querySelector("#editCommentBtn");
      const editModalCloseBtn = document.querySelector("#editModalClose");
      if (api === "post") {
        editCommentInputLabel.textContent = "Reply on Comment";
        editCommentBtn.textContent = "Reply";
      }

      if (editModalCloseBtn !== null) {
        editModalCloseBtn.addEventListener("click", () => {
          editCommentModal.style.display = "none";
        });
      }
      if (editCommentBtn !== null) {
        editCommentBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const editCommentInput =
            document.querySelector("#editCommentInput").value;
          if (editCommentInput.length <= 0) return;
          else {
            try {
              const data = {
                text: editCommentInput,
              };
              const response = await instance[api](
                `/post/comment/${user_id}/${post_id}/${comment_id}`,
                data
              );
              if (response.status === 200) {
                // Edit comment
                editCommentModal.style.display = "none";
                window.location.reload();
                return "Success";
              }
            } catch (error) {
              const errorMessage = error.response.data.message;
              if (errorMessage && errorMessage.length > 0)
                return errorMessage, error.response;
            }
          }
        });
      }
    });
  };

  // Like or Unlike a comment
  if (likeComments !== null) {
    const url_path = "like_unlike_comment";
    const api = "post";
    likeComments.forEach((comment) =>
      manipulateComment(comment, url_path, api)
    );
  }

  // Delete a comment
  if (deleteComments !== null) {
    const url_path = "comment";
    const api = "delete";
    deleteComments.forEach((comment) =>
      manipulateComment(comment, url_path, api)
    );
  }

  // Edit a comment
  if (editComments !== null) {
    const api = "put";
    editComments.forEach((comment) => manipulateEdits(comment, api));
  }

  // Reply on a comment
  if (replyComments !== null) {
    const api = "post";
    replyComments.forEach((comment) => manipulateEdits(comment, api));
  }

export { login, register, upload, myProfile, getProfile }