const urlApi = "https://piwebinars-server.onrender.com";

function filter() {
  const category = localStorage.filter;
  let x = document.getElementsByClassName("title");

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(category)) {
      x[i].style.display = "none";
    }
  }
}

function search() {
  let input = document.getElementById("search").value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName("title");

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    }
  }
}

function searchAllWebinars() {
  renderAllWebinars();
  const postSection = document.querySelector(".webinarsSection");
  let input = document.getElementById("search").value;
  input = input.toLowerCase();
  let x = postSection.getElementsByClassName("title");

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    }
  }
  document.getElementById("clear").style.display = "block";
}

function renderYour(uploadsObj) {
  const postSection = document.querySelector(".yourSection");
  const webinars = uploadsObj["data"]["post"];
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar._id);
      localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinarYour.html";
    };
    renderTitle.textContent = webinar.title;
    renderThumb.className = "thumbnail";
    if (webinar.thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar.thumbnail;
    }

    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    postSection.appendChild(renderDiv);
  }
}

function renderPurchases(uploadsObj) {
  const postSection = document.querySelector(".purchaseSection");
  const webinars = uploadsObj["data"]["posts"];
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderVid = document.createElement("iframe");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "videoTitle";
    renderTitle.textContent = webinar.title;
    renderVid.src = webinar.url;
    renderVid.className = "video";

    renderDiv.appendChild(renderVid);
    renderDiv.appendChild(renderTitle);
    postSection.appendChild(renderDiv);
  }
}

function renderWebinars(uploadsObj) {
  if (window.innerWidth > 619) {
    var postSection = document.querySelector(".webinarsDesktopSection");
  } else {
    var postSection = document.querySelector(".webinarsSection");
  }
  console.log(uploadsObj);
  const webinars = uploadsObj["data"]["list"];
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    const statDiv = document.createElement("div");
    const renderName = document.createElement("p2");
    const renderCategory = document.createElement("p2");
    const renderLike = document.createElement("p2");
    const renderPrice = document.createElement("p2");
    renderDiv.className = "title";
    renderName.onclick = function () {
      localStorage.setItem("user_id", webinar.user);
      location.href = "/html/userProfile.html";
    };
    renderThumb.onclick = function () {
      localStorage.setItem("post_id", webinar._id);
      localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.onclick = function () {
      localStorage.setItem("post_id", webinar._id);
      localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar.title;
    renderThumb.className = "thumbnail";
    if (webinar.thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar.thumbnail;
    }
    statDiv.className = "statDiv";
    renderName.textContent = webinar.name;
    renderName.className = "webinarName";
    renderPrice.textContent = webinar.amount + " Pi";
    renderPrice.className = "webinarPrice";
    renderLike.textContent = "👍" + webinar.likes.length;
    renderLike.className = "webinarLike";
    renderCategory.textContent = webinar.category;
    renderCategory.className = "webinarCategory";

    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    statDiv.appendChild(renderName);
    statDiv.appendChild(renderCategory);
    statDiv.appendChild(renderPrice);
    statDiv.appendChild(renderLike);
    renderDiv.appendChild(statDiv);
    postSection.appendChild(renderDiv);
  }
}

function renderCreators(uploadsObj) {
  const postSection = document.querySelector(".creatorSection");
  const webinars = uploadsObj["data"]["posts"];
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    const statDiv = document.createElement("div");
    const renderName = document.createElement("p2");
    const renderCategory = document.createElement("p2");
    const renderLike = document.createElement("p2");
    const renderPrice = document.createElement("p2");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar._id);
      localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar.title;
    renderThumb.className = "thumbnail";
    if (webinar.thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar.thumbnail;
    }
    statDiv.className = "statDiv";
    renderName.textContent = webinar.name;
    renderName.className = "webinarName";
    renderPrice.textContent = webinar.amount + " Pi";
    renderPrice.className = "webinarPrice";
    renderLike.textContent = "👍" + webinar.likes.length;
    renderLike.className = "webinarLike";
    renderCategory.textContent = webinar.category;
    renderCategory.className = "webinarCategory";

    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    statDiv.appendChild(renderName);
    statDiv.appendChild(renderCategory);
    statDiv.appendChild(renderPrice);
    statDiv.appendChild(renderLike);
    renderDiv.appendChild(statDiv);
    postSection.appendChild(renderDiv);
  }
}

function renderWishlist(webinars) {
  console.log(webinars);
  const postSection = document.querySelector(".wishSection");
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    const statDiv = document.createElement("div");
    const renderName = document.createElement("p2");
    const renderCategory = document.createElement("p2");
    const renderLike = document.createElement("p2");
    const renderPrice = document.createElement("p2");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar.upload);
      // localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      // localStorage.setItem("webinarLikes", webinar.likes.length);
      // localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      // localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar.title;
    renderThumb.className = "thumbnail";
    renderThumb.src = "https://vumbnail.com/" + webinar.video_id + ".jpg";
    statDiv.className = "statDiv";
    renderName.textContent = webinar.name;
    renderName.className = "webinarName";
    renderPrice.textContent = webinar.amount + " Pi";
    renderPrice.className = "webinarPrice";
    // renderLike.textContent = "👍" + webinar.likes.length;
    renderLike.className = "webinarLike";
    renderCategory.textContent = webinar.category;
    renderCategory.className = "webinarCategory";

    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    statDiv.appendChild(renderName);
    statDiv.appendChild(renderCategory);
    statDiv.appendChild(renderPrice);
    statDiv.appendChild(renderLike);
    renderDiv.appendChild(statDiv);
    postSection.appendChild(renderDiv);
  }
}

function renderCategories(uploadsObj) {
  // get category sections
  const cryptocurrency = document.querySelector(".cryptocurrency");
  const technology = document.querySelector(".technology");
  const fitness = document.querySelector(".fitness");
  const education = document.querySelector(".education");
  const food = document.querySelector(".food");
  const history = document.querySelector(".history");
  const money = document.querySelector(".money");
  const nature = document.querySelector(".nature");
  const pinetwork = document.querySelector(".pinetwork");
  const politics = document.querySelector(".politics");
  const sports = document.querySelector(".sports");
  const none = document.querySelector(".none");
  // render webinars
  const webinars = uploadsObj["data"]["list"];
  for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    const statDiv = document.createElement("div");
    const renderName = document.createElement("p2");
    const renderCategory = document.createElement("p2");
    const renderLike = document.createElement("p2");
    const renderPrice = document.createElement("p2");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar._id);
      localStorage.setItem("file_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("video_id", webinar.video_id);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      localStorage.setItem("amount", webinar.amount);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar.title;
    renderThumb.className = "thumbnail";
    if (webinar.thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar.thumbnail;
    }
    statDiv.className = "statDiv";
    renderName.textContent = webinar.name;
    renderName.className = "webinarName";
    renderPrice.textContent = webinar.amount + " Pi";
    renderPrice.className = "webinarPrice";
    renderLike.textContent = "👍" + webinar.likes.length;
    renderLike.className = "webinarLike";
    renderCategory.textContent = webinar.category;
    renderCategory.className = "webinarCategory";
    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    statDiv.appendChild(renderName);
    statDiv.appendChild(renderCategory);
    statDiv.appendChild(renderPrice);
    statDiv.appendChild(renderLike);
    renderDiv.appendChild(statDiv);
    if (webinar.category == "Cryptocurrency") {
      cryptocurrency.appendChild(renderDiv);
    } else if (webinar.category == "Technology") {
      technology.appendChild(renderDiv);
    } else if (webinar.category == "Fitness") {
      fitness.appendChild(renderDiv);
    } else if (webinar.category == "Food") {
      food.appendChild(renderDiv);
    } else if (webinar.category == "History") {
      history.appendChild(renderDiv);
    } else if (webinar.category == "Money") {
      money.appendChild(renderDiv);
    } else if (webinar.category == "Nature") {
      nature.appendChild(renderDiv);
    } else if (webinar.category == "Pi Network") {
      pinetwork.appendChild(renderDiv);
    } else if (webinar.category == "Sports") {
      sports.appendChild(renderDiv);
    } else if (webinar.category == "Politics") {
      politics.appendChild(renderDiv);
    } else if (
      webinar.category == "Education" ||
      webinar.category == "Eduction"
    ) {
      education.appendChild(renderDiv);
    } else {
      none.appendChild(renderDiv);
    }
  }
}

//saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

//getting webinars
async function renderMoreWebinars() {
    const auth_token = localStorage.getItem("userSession");
    const webinarUploads = await axios.get(`${urlApi}/post/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      }
    });
    renderWebinars(webinarUploads);
    const webinars = sessionStorage.getObj("all");
    for (const webinar of webinarUploads.data.list) {
      webinars.data.list.push(webinar);
    }
    sessionStorage.setObj("all", webinars);
}

async function renderMoreCategoryWebinars(category) {
    const auth_token = localStorage.getItem("userSession");
    const data = {
      category,
    }
    const webinarUploads = await axios.get(`${urlApi}/post/category`, data);
    renderCategory(webinarUploads);
    const webinars = sessionStorage.getObj("all");
    for (const webinar of webinarUploads.data.list) {
      webinars.data.list.push(webinar);
    }
    sessionStorage.setObj("all", webinars);
}

function renderCategoryWebinars() {
    const webinarUploads = sessionStorage.getObj("all");
    let currentIndex = webinarUploads.data.list.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [
        webinarUploads.data.list[currentIndex],
        webinarUploads.data.list[randomIndex]
      ] = [
        webinarUploads.data.list[randomIndex],
        webinarUploads.data.list[currentIndex]
      ];
    }
    renderCategories(webinarUploads);
}

async function renderFeaturedWebinars() {
  if (sessionStorage.getItem("all") == undefined) {
    const auth_token = localStorage.getItem("userSession");
    const webinarUploads = await axios.get(`${urlApi}/post/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      }
    });
    renderWebinars(webinarUploads);
    let currentIndex = webinarUploads.data.list.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [
        webinarUploads.data.list[currentIndex],
        webinarUploads.data.list[randomIndex]
      ] = [
        webinarUploads.data.list[randomIndex],
        webinarUploads.data.list[currentIndex]
      ];
    }
    sessionStorage.setObj("all", webinarUploads);
  } else {
    const webinarUploads = sessionStorage.getObj("all");
    let currentIndex = webinarUploads.data.list.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [
        webinarUploads.data.list[currentIndex],
        webinarUploads.data.list[randomIndex]
      ] = [
        webinarUploads.data.list[randomIndex],
        webinarUploads.data.list[currentIndex]
      ];
    }
    renderWebinars(webinarUploads);
  }
}

async function renderYourWebinars() {
    const auth_token = localStorage.getItem("userSession");
    const webinarUploads = await axios.get(`${urlApi}/post`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      }
    });
    sessionStorage.setObj("your", webinarUploads);
    renderYour(webinarUploads);
}

async function renderCreatorsWebinars() {
  const auth_token = localStorage.getItem("userSession");
  const userId = localStorage.getItem("user_id");
  const webinarUploads = await axios.get(`${urlApi}/post/creator/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  renderCreators(webinarUploads);
}

async function renderPurchasedWebinars() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/purchases`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  renderPurchases(webinarUploads);
}

async function renderWishlistWebinars() {
    const auth_token = localStorage.getItem("userSession");
    const webinarUploads = await axios.get(`${urlApi}/post/wishlist`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      }
    });
    const webinars = webinarUploads.data.wishlist;
    renderWishlist(webinars);
}

async function addWishlist() {
  if (sessToken === null || authToken === null) {
    location.href = "/html/login.html";
  }
  const user = localStorage.getItem("user_id");
  const upload = localStorage.getItem("post_id");
  const category = localStorage.webinarCat;
  const title = localStorage.webinarTitle;
  const description = localStorage.webinarDesc;
  const amount = localStorage.amount;
  const video_id = localStorage.video_id;
  const name = localStorage.webinarName;
  const post = {
    user: user,
    upload: upload,
    category: category,
    title: title,
    description: description,
    amount: amount,
    video_id: video_id,
    name: name
  };
  const config = {
    post: post
  };
  const auth_token = localStorage.getItem("userSession");
  const response = await axios.post(`${urlApi}/post/addWishlist`, config, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  console.log(response);
  if (response.status == 200) {
    alert(response.data.message);
    if (response.data.message === "Added to wishlist") {
      document.getElementById("wishlistButton").style.color = "#b44afb";
    } else {
      document.getElementById("wishlistButton").style.color = "#ffffff";
    }
  } else {
    alert("Please retry");
  }
}

async function comment() {
  const userId = localStorage.getItem("user_id");
  const post_id = localStorage.getItem("post_id");
  const authToken = localStorage.userSession;
  const text = prompt("Write comment", "");
  const response = await axios.post(
    `${urlApi}/post/comment/${userId}/${post_id}`,
    text,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`
      }
    }
  );
  if (response.status == 200) {
    alert("success");
  } else {
    alert("Comment failed, please retry");
  }
}

function render_following(uploadsObj) {
  const postSection = document.querySelector(".following");
  const following = uploadsObj["data"]["profile"]["following"];
  if (urlPath === "index.html") {
    for (const creator of following.slice(0, 2)) {
      const renderDiv = document.createElement("article");
      const renderTitle = document.createElement("a");
      renderTitle.className = "followingStyle";
      renderDiv.onclick = function () {
        localStorage.setItem("user_id", creator.user);
        window.location.href = "/html/userProfile.html";
      };
      renderTitle.textContent = creator.handle;

      renderDiv.appendChild(renderTitle);
      postSection.appendChild(renderDiv);
    }
  }
  for (const creator of following) {
    const renderDiv = document.createElement("article");
    const renderTitle = document.createElement("a");
    renderTitle.className = "followingStyle";
    renderDiv.onclick = function () {
      localStorage.setItem("user_id", creator.user);
      window.location.href = "/html/userProfile.html";
    };
    renderTitle.textContent = creator.handle;

    renderDiv.appendChild(renderTitle);
    postSection.appendChild(renderDiv);
  }
}

async function renderFollowing() {
  const auth_token = localStorage.getItem("userSession");
  const profile = await axios.get(`${urlApi}/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  console.log(profile);
  render_following(profile);
}