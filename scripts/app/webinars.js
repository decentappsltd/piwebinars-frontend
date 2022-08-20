const urlApi = "https://piwebinarsdev.herokuapp.com";

//saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

const search = async (input) => {
  if (input) {
    console.log("searching for ", input);
    const response = await axios.get(`${urlApi}/posts/search?q=${input}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.userSession}`
      }
    });
    return response.data.posts;
  }
};

const filter = (input) => {
  let value = input.toLowerCase();
  let x = document.querySelectorAll(".post");

  for (let i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(value)) {
      x[i].style.display = "none";
    } else x[i].style.display = "block";
  }
}

//getting webinars
const renderWebinars = async () => {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(
    `${urlApi}/post/all`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      }
    }
  );
  return webinarUploads;
};

async function renderMore() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/more`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderUploads() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderCreator(userId) {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/creator/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  console.log("creator", webinarUploads);
  return webinarUploads;
}

async function renderPurchases() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/purchases`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderWishlist() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/wishlist`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function addWishlist(props) {
  if (!localStorage.userSession) {
    alert("Please login to add webinar to your wishlist.");
  }
  const config = {
    post: props
  };
  const auth_token = localStorage.getItem("userSession");
  const response = await axios.post(`${urlApi}/post/addWishlist`, config, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return response;
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

async function renderFollowing() {
  const auth_token = localStorage.getItem("userSession");
  const profile = await axios.get(`${urlApi}/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return profile;
}

export {
  search,
  filter,
  renderWebinars,
  renderCreator,
  renderMore,
  renderPurchases,
  renderUploads,
  renderWishlist,
  addWishlist,
  renderFollowing,
  comment
};
