const registerBtn = document.querySelector("#register");
const uploadBtn = document.querySelector("#upload_btn");
const loginBtn = document.querySelector("#login");
const handleBtn = document.querySelector("#handle");
const logoutBtn = document.querySelector("#logout");
const logoutAllBtn = document.querySelector("#logoutAll");
const deleteAccountBtn = document.querySelector("#deleteAccount");
const errorFlash = document.querySelector("#error_log");
const followBtn = document.querySelector("#follow_btn");
const searchBtn = document.querySelector("#search_btn");
const searchDisplay = document.querySelector("#searchedUser");

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
const instance = axios.create({
  baseURL: "https://piwebinars-server.herokuapp.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken}`,
  },
  withCredentials: true,
  credentials: "same-origin",
});
// const instance = axios.create({ baseURL: "http://localhost:5000" });

// Login a user
if (loginBtn !== null) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let username = document.querySelector("#pi_username").value;
    let password = document.querySelector("#user_password").value;

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
          flashMessage = message;
          window.location.href = "/html/createProfile.html";
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
  });
}

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
  });
}

// Create a user profile
if (handleBtn !== null) {
  handleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let handle = document.querySelector("#pi_handle").value;
    const authToken = localStorage.getItem("userSession");

    try {
      if (handle === "") {
        const message = "Cannot send empty fields!!!";
        flashMessage = message;
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
  });
}

// Display profile names
const splitUrl = window.location.href.split("/");
const urlLength = splitUrl.length;
const urlPath = splitUrl[urlLength - 1];
const myProfile = async () => {
  const fullName = document.querySelector("#displayFullName");
  const userHandle = document.querySelector("#displayUserHandle");
  const followers = document.querySelector("#my_followers");
  const following = document.querySelector("#my_following");
  const credit = document.querySelector("#my_credit");
  const elem = document.createElement("i");
  const authToken = localStorage.getItem("userSession");

  try {
    const response = await instance.get(`/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.status === 200) {
      const data = await response.data.profile;
      const {
        user: { name: full_name },
        handle: user_handle,
        people_Who_Follow_Me,
        people_Who_I_Follow,
        credit: piCredit,
      } = data;

      followers.textContent = people_Who_Follow_Me;
      following.textContent = people_Who_I_Follow;
      credit.textContent = `${piCredit}`;
      elem.textContent = `pi`;
      credit.appendChild(elem);
      fullName.textContent = full_name;
      userHandle.textContent = `@${user_handle}`;
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) return errorMessage, error.response;
  }
};
const userProfile = async () => {
  const getUserFromStorage = localStorage.getItem("userProfileName");
  const fullName = document.querySelector("#displayFullName");
  const userHandle = document.querySelector("#displayUserHandle");
  const followers = document.querySelector("#user_followers");
  const following = document.querySelector("#user_following");
  const credit = document.querySelector("#user_credit");
  const elem = document.createElement("i");
  const authToken = localStorage.getItem("userSession");
  if (authToken === null) followBtn.style.display = "none";

  try {
    const response = await instance.get(
      `/profile/handle/${getUserFromStorage}`,
      {
        params: {
          handle: getUserFromStorage,
        },
      }
    );
    const myProfile = await instance.get(`/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if ((response.status && myProfile.status) === 200) {
      const {
        user: { name: full_name, _id: user_id },
        handle: user_handle,
        people_Who_Follow_Me,
        people_Who_I_Follow,
        credit: piCredit,
        followers: userFollowers,
        following: userFollowing,
      } = response.data.profile;
      const {
        user: { _id: self_id },
      } = myProfile.data.profile;
      const hashedId =
        "d1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082";

      followers.textContent = people_Who_Follow_Me;
      following.textContent = people_Who_I_Follow;
      credit.textContent = `${piCredit}`;
      elem.textContent = `pi`;
      credit.appendChild(elem);
      fullName.textContent = full_name;
      userHandle.textContent = `@${user_handle}`;
      followBtn.dataset.userId = `${user_id}${hashedId}`;

      if (self_id === user_id) {
        followBtn.style.display = "none";
      } else {
        const theirFollowing = userFollowing.indexOf(self_id);
        const foundUser = userFollowers.indexOf(self_id);
        if (theirFollowing >= 0 && foundUser < 0)
          followBtn.innerHTML = "Follow Back";
        else if (foundUser >= 0) followBtn.innerHTML = "Unfollow";
        else followBtn.innerHTML = "Follow";
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage && errorMessage.length > 0)
      return errorMessage, error.response;
  }
};
if (urlPath === "profile.html") myProfile();
if (urlPath === "userProfile.html") userProfile();

// Upload webinar
let certify_btn = document.querySelector("#certify");
if (certify_btn !== null) {
  upload_btn.disabled = true;
  certify_btn.addEventListener("click", (e) => {
    if (certify_btn.checked) upload_btn.disabled = false;
    else upload_btn.disabled = true;
  });
}
if (uploadBtn !== null) {
  uploadBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("userSession");
    const file = document.querySelector("#file").value;
    const thumbnail = document.querySelector("#thumbnail").value;
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const amount = document.querySelector("#price").value;
    const category = document.querySelector("#category");
    const categoryOption = category.options[category.selectedIndex];
    const fileType = document.querySelector("#file_type");
    const fileTypeOption = fileType.options[fileType.selectedIndex];
    const { text: catTxt } = categoryOption;
    // const { value : ftOpt, text : ftTxt } = fileTypeOption;

    if ((title || description) === "" || file === null)
      return "Unable to process.";
    else {
      const formData = new FormData();
      formData.append("videoUpload", file);
      formData.append("thumbnailUpload", thumbnail);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("amount", amount);
      formData.append("category", catTxt);

      const uploadData = {
        title: title,
        description,
        category: catTxt,
        amount,
        videoUpload: file.value,
        thumbnailUpload: thumbnail.value,
        ...formData,
      };

      const response = await instance.post(`/upload/file_upload`, formData, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "Content-Type":
            "multipart/form-data; charset=UTF-8; boundary='--sampleBoundary'",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Upload Response : ", response);
    }
  });
}

// Log user out current session
if (logoutBtn !== null) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("userSession");

    try {
      if (authToken === null) {
        flashMessage = "No user is authenticated, please login!!!";
      } else {
        const response = await instance.post(`/logout`);
        if (response.status === 200) {
          flashMessage = `Successfully logged you out!!!`;
          delete instance.defaults.headers.common["Authorization"];
          sessionStorage.removeItem("userSession");
          localStorage.removeItem("userSession");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
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

// Log out all other sessions except current session
if (logoutAllBtn !== null) {
  logoutAllBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("userSession");

    try {
      if (authToken === null) {
        flashMessage = "No user is authenticated, please login!!!";
      } else {
        const response = await instance.post(`/logout/logout_all`);
        if (response.status === 200) {
          flashMessage = `Successfully logged out from other devices!!!`;
        }
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

// Delete account
if (deleteAccountBtn !== null) {
  deleteAccountBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmMessage = confirm(
      "Are you sure you want to delete your account? This CANNOT be undone!!!"
    );
    if (!confirmMessage) return false;
    else {
      try {
        const authToken = localStorage.getItem("userSession");
        if (authToken === null) {
          flashMessage = "No user is authenticated, please login!!!";
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
            flashMessage = `You have successfully deleted your account!!!`;
            delete instance.defaults.headers.common["Authorization"];
            sessionStorage.removeItem("userSession");
            localStorage.removeItem("userSession");
            setTimeout(() => {
              window.location.href = "/html/register.html";
            }, 3000);
          }
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage.length > 0) flashMessage = errorMessage;
      }
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
          localStorage.setItem("userProfileName", searchName);
          const {
            handle,
            user: { name: user_name },
          } = response.data.profile;

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

// Follow or Unfollow a user
if (followBtn !== null) {
  followBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let user_id = await followBtn.dataset.userId.substr(0, 24).toString();

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
      if (response.status === 200) window.location.reload();
    } catch (error) {
      const errorMessage = error.response.data.message;
      return errorMessage;
    }
  });
}

// Display webinars
const showWebinar = (webinarId, creatorId, categoryId) => {
  var userId = creatorId;
  var file_id = webinarId;
  var collection_name = categoryId;
  const purchasedWebinarJSON = axios.get(
    `/upload/${collection_name}/${userId}/${file_id}`
  );
  const purchasedWebinar = JSON.parse(purchasedWebinarJSON);
  const currentWebinar = purchasedWebinar["upload"];
  document.getElementById("modal1").classList.add("isVisible");
  document.getElementById("usersPurchase").src = currentWebinar[i].file;
  renderComments(purchasedWebinar);
  document.getElementById("followCreator").onclick = function () {
    axios.post(`/auth_follow_unfollow/${userId}`);
  };
};

function renderComments(purchasedWebinar) {
  const currentComments = purchasedWebinar["comments"];
  const commentDiv = document.getElementById("comments");
  for (let i = 0; i < currentComments.length; i++) {
    const renderMessage = document.createElement("p3");
    const renderCommentLikes = document.createElement("h6");
    const renderLikeButton = document.createElement("button");
    renderLikeButton.className = "likeComment";
    renderLikeButton.onclick = function () {
      var webinarId = currentComments[i].post_id;
      var creatorId = currentComments[i].userId;
      var commentId = currentComments[i].comment_;
    };
    const renderReplyButton = document.createElement("button");
    renderReplyButton.className = "replyComment";
    renderReplyButton.onclick = function () {
      var webinarId = currentComments[i].post_id;
      var creatorId = currentComments[i].userId;
      var commentId = currentComments[i].comment_id;
    };
    renderMessage.textContent = currentComments[i].comment_text;
    renderCommentLikes.textContent = currentComments[i].comment_likes;
    renderLikeButton.textContent = "Like Comment";
    renderReplyButton.textContent = "Reply Comment";

    commentDiv.appendChild(renderMessage);
    commentDiv.appendChild(renderCommentLikes);
    commentDiv.appendChild(renderLikeButton);
    commentDiv.appendChild(renderReplyButton);

    section.appendChild(commentDiv);
  }
}

function buyCredits(creditAmount) {
  axios.post(`/profile/credit`, function (res, req) {
    res.send(creditAmount);
  });
}

function openCinema() {
  document.getElementById("modal1").classList.add("is-visible");
}

function closeCinema() {
  document.getElementById("modal1").classList.remove("is-visible");
}

function openUploadPage() {
  document.getElementById("modal2").classList.add("is-visible");
}

function closeUploadPage() {
  document.getElementById("modal2").classList.remove("is-visible");
}

function openModal3() {
  document.getElementById("modal3").classList.add("is-visible");
}

function closeModal3() {
  document.getElementById("modal3").classList.remove("is-visible");
}

function openModal4() {
  document.getElementById("modal4").classList.add("is-visible");
}

function closeModal4() {
  document.getElementById("modal4").classList.remove("is-visible");
}

function openModal5() {
  document.getElementById("modal5").classList.add("is-visible");
}

function closeModal5() {
  document.getElementById("modal5").classList.remove("is-visible");
}

function openModal6() {
  document.getElementById("modal6").classList.add("is-visible");
}

function closeModal6() {
  document.getElementById("modal6").classList.remove("is-visible");
}

function showMore(featured, webinars) {
  var x = featured.length;
  var feature = webinars.slice(0, x + 20);
}

function searchWebinars() {
  var results = [];
  var searchField = document.querySelector("#search");
  for (var i = 0; i < obj.list.length; i++) {
    if (obj.list[i][searchField] == searchVal) {
      results.push(obj.list[i]);
    }
  }
}

function googleTranslate() {
  document.getElementById("google_translate_element").style.display = "block";
  document.getElementById("translate").style.display = "none";
}
