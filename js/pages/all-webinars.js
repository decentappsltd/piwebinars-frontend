const searchCat = document.querySelector(".searchCat");
const search = document.querySelector(".search");
const instance = axios.create({
  baseURL: "https://piwebinars-server.herokuapp.com",
});

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

const postSection = document.querySelector("#postSection");
document.addEventListener("DOMContentLoaded", async function (event) {
  event.preventDefault();
  const webinarUploads = await instance.get("/upload/video");
  //   const webinarUploads = JSON.parse(webinarUploadsJson);
  // console.log(webinarUploads);
  renderWebinars(webinarUploads);
});

function renderWebinars(uploadsObj) {
  const webinars = uploadsObj["data"]["Webinars"];
  console.log("webinars : ", webinars);
  webinars.forEach(async (webinar) => {
    const { amount, cloudPath, category, path, post, thumbnail, _id, user } =
      webinar;
    const webinarPosts = await instace.get(`/post/${user}/${post}`);
    console.log("web posts ", webinarPosts);
    // const posts = webinarPosts["data"]["Post"];
    // if (!posts.success) return;
    // else console.log("posts ", posts);
    const { title, description, name, likes, avatar } = posts;
    const renderDiv = document.createElement("article");
    const renderTitle = document.createElement("h3");
    const renderDesc = document.createElement("p");
    const renderCategory = document.createElement("p");
    const renderImg = document.createElement("img");
    const renderVideo = document.createElement("video");
    const renderLikes = document.createElement("p");
    const renderAuthor = document.createElement("p");
    const renderButton = document.createElement("button");
    renderDiv.className = "webinar";
    renderImg.className = "thumbnail";
    renderLikes.className = "likes";
    renderButton.className = "button_click browser";
    renderButton.innerHTML = `Pi ${amount.toFixed(2)}`;
    renderButton.onclick = function () {
      var webinarId = post_id;
      var creatorId = userId;
      var categoryId = collection_name;
      buyWebinar(webinarId, creatorId, categoryId);
    };
    renderTitle.textContent = title;
    renderImg.src = avatar;
    renderVideo.src = path;
    renderCategory.textContent = category;
    renderImg.imgContent = thumbnail;
    renderDesc.textContent = description;
    renderAuthor.textContent = name;
    renderLikes.textContent = likes;
    renderDiv.appendChild(renderTitle);
    renderDiv.appendChild(renderVideo);
    renderDiv.appendChild(renderDesc);
    renderDiv.appendChild(renderAuthor);
    renderDiv.appendChild(renderLikes);
    renderDiv.appendChild(renderButton);
    postSection.appendChild(renderDiv);
  });
}
