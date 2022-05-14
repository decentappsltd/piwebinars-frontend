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
// const instance = axios.create({ baseURL: "http://localhost:5000" });

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
          // if (navigator.userAgent.toLowerCase().indexOf("pibrowser")>=0) {
          //   addUID();
          // }
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
        following: userFollowing,
        verified: verified,
      } = data;
      console.log(response.data);
      sessionStorage.user = response.data.profile.user._id;

      followers.textContent = people_Who_Follow_Me;
      following.textContent = people_Who_I_Follow;
      credit.textContent = `${piCredit}`;
      elem.textContent = `pi`;
      credit.appendChild(elem);
      fullName.textContent = full_name;
      userHandle.textContent = `@${user_handle}`;
      localStorage.setItem("following", userFollowing);
      if (verified == true) {
        document.getElementById("verified_icon").src = "/img/Verified_Icon.png";
      }

      // Dynamic profile dom stats display
      createUserProfile.style.display = "none";
      document.querySelector(".stats").style.display = "block";
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

// Render contents of the selected post
const webinarPost = async () => {
  const likesCount = document.querySelector("#totalLikes");
  const dislikesCount = document.querySelector("#totalDislikes");
  const likeUnlikePostBtn = document.querySelector("#likeUnlikePost");
  const dislikePostBtn = document.querySelector("#dislikePost");
  const postCommentBtn = document.querySelector("#postComment");
  const commentValue = document.querySelector("#text");
  const commentFormSection = document.querySelector("#commentForm");

  const userId = localStorage.getItem("user_id");
  const post_id = localStorage.getItem("post_id");
  const authToken = localStorage.getItem("userSession");

  const getPostResponse = await instance.get(`/post/${userId}/${post_id}`, {
    params: {
      userId,
    },
  });

  console.log("post ", getPostResponse);

  try {
    const myProfile = await instance.get(`/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (getPostResponse.status === 200) {
      // Render comments
      const { comments, dislike, likes } = await getPostResponse.data.Post;

      likesCount.textContent = likes.length;
      dislikesCount.textContent = dislike.length;

      if (comments.length <= 0) {
        const noComments = `<p class="noComments">No Comments made yet on this post, be the first to comment</p>`;
        commentsDisplay.innerHTML = noComments;
      } else {
        // commentsDisplay.appendChild(commentSection)
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage && errorMessage.length > 0)
      return errorMessage, error.response;
  }

  if (getPostResponse.status === 200) {
    const { likes, dislike } = getPostResponse.data.Post;
    const liked = likes.find(({ user }) => user.toString() === userId);
    const disLiked = dislike.find(({ user }) => user.toString() === userId);
    if (liked === undefined) likeUnlikePostBtn.textContent = "Like";
    else likeUnlikePostBtn.textContent = "Unlike";
    if (disLiked === undefined) dislikePostBtn.textContent = "Dislike";
    else dislikePostBtn.textContent = "Disliked";

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
          data,
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
        console.log("Response: ", response);
        if (response.status === 200) {
          // Make comment
          // console.log(response.data);
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      const errorMessage = error.response.data.message;
      if (errorMessage && errorMessage.length > 0)
        return errorMessage, error.response;
    }
  }
};

if (urlPath === "profile.html") myProfile();
if (urlPath === "userProfile.html") userProfile();
if (urlPath === "webinar.html") webinarPost();

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
      } finally {
        const message = "Successfully uploaded your webinar !!!";
        flashMessage = message;
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
