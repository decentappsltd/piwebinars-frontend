const formSection = document.querySelector("#form");
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
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken}`,
  },
  withCredentials: true,
  credentials: "same-origin",
});

if (sessToken !== null) {
  authNavv.forEach((elem) => {
    elem.classList.remove("authNav");
    elem.classList.add("showNav");
  });
  unAuthNavv.forEach((elem) => {
    elem.classList.remove(elem);
  });
} else {
  authNavv.forEach((elem) => {
    elem.classList.remove("unAuthNav");
    elem.classList.add("showNav");
  });
  unAuthNavv.forEach((elem) => {
    elem.classList.remove("unAuthNav");
    elem.classList.add("hideNav");
  });
}

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
if (loginBtn !== null) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let username = document.querySelector("#pi_username").value;
    let password = document.querySelector("#user_password").value;
    let uid = localStorage.uid;

    try {
      if ((username || password) === "") {
        const message = "Cannot send empty fields!!!";
        flashMessage = message;
      } else {
        const user = {
          username,
          password,
          uid,
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
          referral,
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
        following: userFollowing,
        verified: verified,
        wishlist: userWishlist,
      } = data;
      sessionStorage.user = response.data.profile.user._id;

      followers.textContent = people_Who_Follow_Me;
      following.textContent = people_Who_I_Follow;
      credit.textContent = `${piCredit}`;
      elem.textContent = `pi`;
      credit.appendChild(elem);
      fullName.textContent = full_name;
      userHandle.textContent = `@${user_handle}`;
      localStorage.setObj("following", userFollowing);
      localStorage.setObj("wishlist", userWishlist);
      if (verified == true) {
        document.getElementById("verified_icon").src = "/img/Verified_Icon.png";
      }

      // Dynamic profile dom stats display
      createUserProfile.style.display = "none";
      document.querySelector(".stats").style.display = "block";
    } else {
      document.getElementById("interactWithProfile").style.display = "none";
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) return errorMessage, error.response;
  }
};

const userProfile = async () => {
  const getUserFromStorage = localStorage.getItem("user_id");
  const fullName = document.querySelector("#displayFullName");
  const userHandle = document.querySelector("#displayUserHandle");
  const followers = document.querySelector("#user_followers");
  const following = document.querySelector("#user_following");
  const elem = document.createElement("i");
  const authToken = localStorage.getItem("userSession");
  if (authToken === null) followBtn.style.display = "none";

  try {
    const response = await instance.get(`/profile/user/${getUserFromStorage}`, {
      params: {
        user_id: getUserFromStorage,
      },
    });
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
        verified: verified,
      } = response.data.profile;
      const {
        user: { _id: self_id },
      } = myProfile.data.profile;
      const hashedId =
        "d1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082";

      followers.textContent = people_Who_Follow_Me;
      following.textContent = people_Who_I_Follow;
      elem.textContent = `pi`;
      fullName.textContent = full_name;
      userHandle.textContent = `@${user_handle}`;
      followBtn.dataset.userId = `${user_id}${hashedId}`;
      if (verified == true) {
        document.getElementById("verified_icon").src = "/img/Verified_Icon.png";
      }
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

const renderHomePage = async () => {
  const profile = await instance.get(`/profile`);
  if (profile.status === 200) {
    const currentUserId = await profile.data.profile.user._id;
    const profileId = "61eecd5342e7b51ab2291814";
    localStorage.setItem("currentUser", currentUserId);
    sessionStorage.setItem("currentUser", currentUserId);
    const userNotFound = profile.data.profile.following.filter(
      ({ user }) => user.toString() === profileId
    );
    if (userNotFound.length <= 0) {
      const response = await instance.post(
        `/profile/auth_follow_unfollow/${profileId}`,
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
      return "Success";
    } else return null;
  }
};

if (urlPath === "") renderHomePage();
if (urlPath === "profile.html") myProfile();
if (urlPath === "userProfile.html") userProfile();

const webinarPost = async (getPostResponse) => {
  const likesCount = document.querySelector("#totalLikes");
  const dislikesCount = document.querySelector("#totalDislikes");
  const likeUnlikePostBtn = document.querySelector("#likeUnlikePost");
  const dislikePostBtn = document.querySelector("#dislikePost");
  const postCommentBtn = document.querySelector("#postComment");
  let commentValue = document.querySelector("#text");
  const commentFormSection = document.querySelector("#commentForm");

  const userId = localStorage.getItem("user_id");
  const post_id = localStorage.getItem("post_id");
  const authToken = localStorage.getItem("userSession");

  try {
    if (getPostResponse.status === 200) {
      // Render comments
      const { comments, dislike, likes } = await getPostResponse.data.Post;

      likesCount.textContent = likes.length;
      dislikesCount.textContent = dislike.length;

      if (comments.length <= 0) {
        const noComments = `<br><p class="noComments">No comments made on this post yet, be the first</p>`;
        commentsDisplay.innerHTML = noComments;
      } else {
        // commentsDisplay.appendChild(commentSection);
        renderComments(comments);
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage && errorMessage.length > 0)
      return errorMessage, error.response;
  }

  if (getPostResponse.status === 200) {
    const { likes, dislike } = getPostResponse.data.Post;
    let liked = likes.filter(function (e) {
      return e.user === sessionStorage.user;
    });
    let disLiked = dislike.filter(function (e) {
      return e.user === sessionStorage.user;
    });
    if (!liked.length) likeUnlikePostBtn.style.color = "#ffffff";
    else likeUnlikePostBtn.style.color = "#fbb44a";
    if (!disLiked.length) dislikePostBtn.style.color = "#ffffff";
    else dislikePostBtn.style.color = "#fbb44a";

    likeUnlikePostBtn.addEventListener("click", async (e) => {
      try {
        const response = await instance.post(
          `/post/like_unlike_post/${userId}/${post_id}`,
          {
            params: {
              userId,
            },
          }
        );
        if (response.status === 200) {
          // Like and Unlike comments
          window.location.reload();
          return "success";
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage && errorMessage.length > 0)
          return errorMessage, error.response;
      }
    });
    dislikePostBtn.addEventListener("click", async (e) => {
      try {
        const response = await instance.post(
          `/post/dislike_post/${userId}/${post_id}`,
          {
            params: {
              userId,
            },
          }
        );
        if (response.status === 200) {
          // Dislike comments
          window.location.reload(true);
          return "success";
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage && errorMessage.length > 0)
          return errorMessage, error.response;
      }
    });
  }

  if (postCommentBtn !== null) {
    try {
      postCommentBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (commentValue.length <= 0) return;
        const data = { text: commentValue.value };
        const response = await instance.post(
          `/post/comment/${userId}/${post_id}`,
          data
        );
        if (response.status === 200) {
          // Make comment
          window.location.reload();
          return "Success";
        }
      });
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage && errorMessage.length > 0)
        return errorMessage, error.response;
    }
  }
};

// Upload webinar
const video = document.querySelector("#videoUpload");
const thumbnail = document.querySelector("#thumbnailUpload");
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
    const category = document.querySelector("#category");
    const categoryOption = category.options[category.selectedIndex];
    const fileType = document.querySelector("#file_type");
    const fileTypeOption = fileType.options[fileType.selectedIndex];
    const { text: categoryValue } = categoryOption;
    // const { value : ftOpt, text : ftTxt } = fileTypeOption;
    const formData = new FormData(formSection);
    formData.append("category", categoryValue);

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
        }, flashTime);
      }
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
          localStorage.removeItem("currentUser");
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

function renderComments(comments) {
  const commentsBox = document.querySelector("#commentsContainer");
  const sess_user_id = sessionStorage.getItem("currentUser");
  const sortedComments = comments
    .slice()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  for (const comment of sortedComments) {
    const commentDiv = document.createElement("div");
    const interactiveDiv = document.createElement("div");
    const message = document.createElement("p");
    const name = document.createElement("p");
    const date = document.createElement("p");
    const avatar = document.createElement("img");
    const likesCount = document.createElement("p");
    const likeComment = document.createElement("button");
    const editComment = document.createElement("button");
    const deleteComment = document.createElement("button");
    const numberOfLikes = comment.comment_likes.length;

    commentDiv.className = "commentDiv";
    likesCount.textContent = `${numberOfLikes} like${
      numberOfLikes <= 1 ? "" : "s"
    }`;
    likeComment.setAttribute("class", "likeComment");
    likeComment.textContent = "Like-unlike Comment";
    likeComment.dataset.comment_id = comment._id;
    editComment.setAttribute("class", "editComment");
    editComment.textContent = "Edit Comment";
    editComment.dataset.comment_id = comment._id;
    deleteComment.setAttribute("class", "deleteComment");
    deleteComment.textContent = "Delete Comment";
    deleteComment.dataset.comment_id = comment._id;
    message.className = "commentText";
    name.className = "commentName";
    date.className = "commentDate";
    avatar.className = "commentAvatar";
    message.textContent = comment.text;
    name.textContent = comment.name;
    date.textContent = comment.dateAdded.substring(0, 10);
    if (comment.avatar) {
      avatar.src = comment.avatar;
    } else {
      avatar.src = "/img/avatar.png";
    }

    commentDiv.appendChild(avatar);
    commentDiv.appendChild(name);
    commentDiv.appendChild(date);
    interactiveDiv.appendChild(likesCount);
    interactiveDiv.appendChild(likeComment);
    if (comment.user === sess_user_id) {
      interactiveDiv.appendChild(editComment);
      interactiveDiv.appendChild(deleteComment);
    }
    commentsBox.appendChild(commentDiv);
    commentsBox.appendChild(message);
    commentsBox.appendChild(interactiveDiv);
  }
  const likeComments = document.querySelectorAll(".likeComment");
  const deleteComments = document.querySelectorAll(".deleteComment");
  const editComments = document.querySelectorAll(".editComment");

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
    editComments.forEach((comment) => {
      const editCommentModal = document.querySelector("#editCommentModal");
      comment.addEventListener("click", async (e) => {
        editCommentModal.style.display = "flex";
        const user_id = localStorage.getItem("user_id");
        const post_id = localStorage.getItem("post_id");
        const comment_id = e.target.dataset.comment_id;
        const editCommentBtn = document.querySelector("#editCommentBtn");
        const editModalCloseBtn = document.querySelector("#editModalClose");

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
                const response = await instance.put(
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
    });
  }
}

//
function buyCredits(creditAmount) {
  axios.post(`/profile/credit`, function (res, req) {
    res.send(creditAmount);
  });
}

function openCinema() {
  document.getElementById("modal1").classList.add("cinema-visible");
}

function closeCinema() {
  document.getElementById("modal1").classList.remove("cinema-visible");
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

function openModal7() {
  document.getElementById("modal7").classList.add("is-visible");
}

function closeModal7() {
  document.getElementById("modal7").classList.remove("is-visible");
}

function openLandingPage() {
  document.getElementById("landingPage").classList.add("is-visible");
}

function closeLandingPage() {
  document.getElementById("landingPage").classList.remove("is-visible");
}

function openInfo() {
  document.getElementById("info").classList.add("cinema-visible");
}

function closeInfo() {
  document.getElementById("info").classList.remove("cinema-visible");
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

// window.onload = function () {
//   console.clear();
// };
