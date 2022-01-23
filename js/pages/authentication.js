const registerBtn = document.querySelector("#register");
const uploadBtn = document.querySelector("#upload_btn");
const loginBtn = document.querySelector("#login");
const handleBtn = document.querySelector("#handle");
const errorFlash = document.querySelector("#error_log");
const instance = axios.create({
  baseURL: "https://piwebinars-server.herokuapp.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
  credentials: "same-origin",
});
// const instance = axios.create({ baseURL: "http://localhost:5000" });
let token;
let flashMessage = "";
let flashBool = false;

// Login a user
if (loginBtn !== null) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let username = document.querySelector("#pi_username").value;
    let password = document.querySelector("#user_password").value;

    try {
      if (username === "" || password === "") {
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
      const elem = document.createElement("p");
      elem.textContent = flashMessage;
      errorFlash.appendChild(elem);
      setTimeout(() => {
        flashMessage = "";
        flashBool = false;
        errorFlash.removeChild(elem);
      }, 4000);
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
      if (
        fullName === "" ||
        username === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
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
          }, 5000);
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
      const elem = document.createElement("p");
      elem.textContent = flashMessage;
      errorFlash.appendChild(elem);
      setTimeout(() => {
        flashMessage = "";
        flashBool = false;
        errorFlash.removeChild(elem);
      }, 4000);
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
      console.log(errorMessage, error.response);
    }

    flashBool = true;
    handle.textContent = "";

    // Flash message
    if (flashBool && flashMessage.length > 0) {
      const elem = document.createElement("p");
      elem.textContent = flashMessage;
      errorFlash.appendChild(elem);
      setTimeout(() => {
        flashMessage = "";
        flashBool = false;
        errorFlash.removeChild(elem);
      }, 4000);
    }
  });
}

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

    if (title === "" || description === "" || file === null)
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
