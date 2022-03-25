const searchCat = document.querySelector("#searchCat");
const search = document.querySelector("#search");

if (searchCat !== null) {
  searchCat.addEventListener("click", function (e) {
    e.preventDefault();
    var results = [];
    var searchField = "categories";
    var searchVal = document.querySelector("#select");
    for (var i = 0; i < obj.list.length; i++) {
      if (obj.list[i][searchField] == searchVal) {
        results.push(obj.list[i]);
      }
    }
  });
}

if (search !== null) {
  search.addEventListener("click", function (e) {
    e.preventDefault();
    var results = [];
    var searchField = document.querySelector("#search");
    for (var i = 0; i < obj.list.length; i++) {
      if (obj.list[i][searchField] == searchVal) {
        results.push(obj.list[i]);
      }
    }
  });
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
      localStorage.setItem("post_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      window.location.href = "/html/webinar.html";
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
  };
}

function renderPurchases(uploadsObj) {
  const postSection = document.querySelector(".purchaseSection");
  const webinars = uploadsObj["data"]["post"];
 for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar[1].upload);
      localStorage.setItem("user_id", webinar[1].user);
      localStorage.setItem("webinarTitle", webinar[1].title);
      localStorage.setItem("webinarDesc", webinar[1].description);
      localStorage.setItem("webinarCat", webinar[1].category);
      localStorage.setItem("webinarName", webinar[1].name);
      localStorage.setItem("webinarLikes", webinar[1].likes.length);
      localStorage.setItem("webinarDislikes", webinar[1].dislikes);
      localStorage.setItem("webinarDate", webinar[1].dateAdded);
      localStorage.setItem("webinarComments", webinar[1].comments);
      window.location.href = "/html/webinar.html";
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
  };
}

function renderAll(uploadsObj) {
  const postSection = document.querySelector(".postSection");
  const webinars = uploadsObj["data"]["list"];
 for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar[1].upload);
      localStorage.setItem("user_id", webinar[1].user);
      localStorage.setItem("webinarTitle", webinar[1].title);
      localStorage.setItem("webinarDesc", webinar[1].description);
      localStorage.setItem("webinarCat", webinar[1].category);
      localStorage.setItem("webinarName", webinar[1].name);
      localStorage.setItem("webinarLikes", webinar[1].likes.length);
      localStorage.setItem("webinarDislikes", webinar[1].dislikes);
      localStorage.setItem("webinarDate", webinar[1].dateAdded);
      localStorage.setItem("webinarComments", webinar[1].comments);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar[1].title;
    renderThumb.className = "thumbnail";
    if (webinar[1].thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar[1].thumbnail;
    }
   
    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    postSection.appendChild(renderDiv);
  };
}

function renderFeatured(uploadsObj) {
  const postSection = document.querySelector(".featuredSection");
  const webinars = uploadsObj["data"]["list"];
 for (const webinar of webinars.slice(0, 24)) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar[1].upload);
      localStorage.setItem("user_id", webinar[1].user);
      localStorage.setItem("webinarTitle", webinar[1].title);
      localStorage.setItem("webinarDesc", webinar[1].description);
      localStorage.setItem("webinarCat", webinar[1].category);
      localStorage.setItem("webinarName", webinar[1].name);
      localStorage.setItem("webinarLikes", webinar[1].likes.length);
      localStorage.setItem("webinarDislikes", webinar[1].dislikes);
      localStorage.setItem("webinarDate", webinar[1].dateAdded);
      localStorage.setItem("webinarComments", webinar[1].comments);
      window.location.href = "/html/webinar.html";
    };
    renderTitle.textContent = webinar[1].title;
    renderThumb.className = "thumbnail";
    if (webinar[1].thumbnail == undefined) {
      renderThumb.src = "/img/empty.png";
    } else {
      renderThumb.src = webinar[1].thumbnail;
    }
   
    renderDiv.appendChild(renderThumb);
    renderDiv.appendChild(renderTitle);
    postSection.appendChild(renderDiv);
  };
}

function renderCreators(uploadsObj) {
  const postSection = document.querySelector(".creatorSection");
  const webinars = uploadsObj["data"]["posts"];
 for (const webinar of webinars) {
    const renderDiv = document.createElement("article");
    const renderThumb = document.createElement("img");
    const renderTitle = document.createElement("h3");
    renderDiv.className = "title";
    renderDiv.onclick = function () {
      localStorage.setItem("post_id", webinar.upload);
      localStorage.setItem("user_id", webinar.user);
      localStorage.setItem("webinarTitle", webinar.title);
      localStorage.setItem("webinarDesc", webinar.description);
      localStorage.setItem("webinarCat", webinar.category);
      localStorage.setItem("webinarName", webinar.name);
      localStorage.setItem("webinarLikes", webinar.likes.length);
      localStorage.setItem("webinarDislikes", webinar.dislikes);
      localStorage.setItem("webinarDate", webinar.dateAdded);
      localStorage.setItem("webinarComments", webinar.comments);
      window.location.href = "/html/webinar.html";
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
  };
}

//showing webinar once purchased
async function showWebinar() {
  const authTkn = localStorage.getItem("userSession");
  const collection_name = "video";
  const userId = localStorage.getItem("user_id");
  const file_id = localStorage.getItem("post_id");
  
  const upload = await axios.get(`https://piwebinars-server.herokuapp.com/upload/${collection_name}/${userId}/${file_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTkn}`,
    },
  });
  
  const video = "https://player.vimeo.com" + upload.data.webinar_url;
  //TODO add video source and iframe player in cinema
}

//saving arrays to session storage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

//getting webinars
async function renderAllWebinars() {
  if ( sessionStorage.getItem("all") == undefined ) {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get("https://piwebinars-server.herokuapp.com/post/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    });
  sessionStorage.setObj("all", webinarUploads);
  renderAll(webinarUploads);
  } else {
    const webinarUploads = sessionStorage.getObj("all");
    renderAll(webinarUploads);
  }
}

async function renderFeaturedWebinars() {
  if ( sessionStorage.getItem("featured") == undefined ) {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get("https://piwebinars-server.herokuapp.com/post/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    });
    sessionStorage.setObj("featured", webinarUploads);
    renderFeatured(webinarUploads);
  } else {
    const webinarUploads = sessionStorage.getObj("featured");
    renderFeatured(webinarUploads);
  }
}

async function renderYourWebinars() {
  if ( sessionStorage.getItem("your") == undefined ) {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get("https://piwebinars-server.herokuapp.com/post", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    });
  sessionStorage.setObj("your", webinarUploads);
    renderYour(webinarUploads);
  } else {
    const webinarUploads = sessionStorage.getObj("your");
    renderYour(webinarUploads);
  }
}

async function renderCreatorsWebinars() {
  const auth_token = localStorage.getItem("userSession");
  const userId = localStorage.getItem("user_id");
  const webinarUploads = await axios.get(`https://piwebinars-server.herokuapp.com/post/creator/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    });
    renderCreators(webinarUploads);
}

// async function renderPurchasedWebinars() {
//   if ( sessionStorage.getItem("purchases") == undefined ) {
//   const auth_token = localStorage.getItem("userSession");
//   const webinarUploads = await axios.get("https://piwebinarsdev.herokuapp.com/post/purchases", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${auth_token}`,
//       },
//     });
//   sessionStorage.setObj("purchases", webinarUploads);
//     renderPurchases(webinarUploads);
//   } else {
//     const webinarUploads = sessionStorage.getObj("purchases");
//     renderPurchases(webinarUploads);
//   }
// }