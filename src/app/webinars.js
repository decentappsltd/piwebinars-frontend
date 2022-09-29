import axios from 'axios';

const urlApi = "https://piwebinars-server.onrender.com";

//saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

const search = async (input) => {
  if (input) {
    console.log("searching for ", search);
    const response = await axios.get(`${urlApi}/post/search`, {
      params: {
        input: input,
      }
    });
    console.log(response);
    return response.data.list;
  }
};

const filter = (input) => {
  console.log(input);
  let value = input.toLowerCase();
  let x = document.querySelectorAll(".post");

  for (let i = 0; i <= x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(value)) {
      x[i].style.display = "none";
    } else x[i].style.display = "block";
  }
};

// Get individual webinar by its IDs
async function getPost(userId, post_id) {
  const response = await axios.get(`${urlApi}/post/${userId}/${post_id}`);
  return response.data.Post;
}

// Get homepage webinars
const renderWebinars = async () => {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
};

// Get more webinars for infinite scrolling
async function renderMore(category) {
  if (category == '') category = 'all';
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/more/${category}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

// Get user's uploads
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

// Get a creator's uploads for profile
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

// Get user's purchases
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

// Get webinars on user's wishlist
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

// Add a webinar to user's wishlist
async function addWishlist(props) {
  if (!localStorage.userSession) {
    alert("Please login to add webinar to your wishlist.");
  }
  console.log(props);
  const config = {
    post: props
  };
  const auth_token = localStorage.getItem("userSession");
  const response = await axios.post(`${urlApi}/post/addWishlist`, config, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  }).catch((error) => {
    alert("Please login");
  });
  return response;
}

// Comment on a webinar
async function comment(userId, post_id, text) {
  const authToken = localStorage.userSession;
  const response = await axios.post(
    `${urlApi}/post/comment/${userId}/${post_id}`,
    { text },
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

// Get list of creators the user is following
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

// Edit an upload
async function editWebinar(userId, post_id, title, price, description) {
  const authTkn = localStorage.getItem("userSession");
  const data = {
    title: title,
    amount: price,
    description: description
  };
  const response = await axios.put(
    `${urlApi}/post/${userId}/${post_id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTkn}`
      }
    }
  );
  if (response.status === 200) {
    alert("Updated successfully!");
  } else {
    alert("Update failed, please try again later");
  }
}

// Delete an upload
async function deleteWebinar(userId, post_id) {
  const authTkn = localStorage.getItem("userSession");
  const confirmation = window.confirm(
    "Are you sure you want to permanently delete your webinar?"
  );
  if (confirmation === true) {
    const response = await axios.delete(
      `${urlApi}/post/${post_id}`,
      {
        params: {
          userId: userId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTkn}`
        }
      }
    );
    if (response.status === 200) {
      alert("Webinar deleted");
      return "deleted";
    } else {
      alert(response.data.message);
    }
  }
}

async function likeWebinar(userId, post_id) {
  try {
    const authTkn = localStorage.getItem("userSession");
    const response = await axios.post(
      `${urlApi}/post/like_unlike_post/${userId}/${post_id}`,
      {
        params: {
          userId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTkn}`
        }
      }
    );
    if (response.status === 200) {
      return "success";
    }
  } catch (error) {
    alert("Please login or register");
    console.error(error);
  }
}

async function dislikeWebinar(userId, post_id) {
  try {
    const authTkn = localStorage.getItem("userSession");
    const response = await axios.post(
      `${urlApi}/post/dislike_post/${userId}/${post_id}`,
      {
        params: {
          userId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTkn}`
        }
      }
    );
    if (response.status === 200) {
      return "success";
    }
  } catch (error) {
    alert("Please login or register");
    console.error(error);
  }
}

export {
  search,
  filter,
  getPost,
  renderWebinars,
  renderCreator,
  renderMore,
  renderPurchases,
  renderUploads,
  renderWishlist,
  addWishlist,
  renderFollowing,
  comment,
  editWebinar,
  deleteWebinar,
  likeWebinar,
  dislikeWebinar
};
