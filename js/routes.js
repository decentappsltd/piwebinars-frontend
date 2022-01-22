//post routes
const url = "https://server.piwebinars.co.uk/"
function createPost() {
  axios.post(`${url}post`, function (res, req) {
    const thumbnail = document.getElementById("thumbnail").value;
    const collection_name = document.getElementById("category").value;
    const amount = document.getElementById("price").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    res.send(title, description, thumbnail, collection_name, amount);
  });
  const file_type = document.getElementById("file_type").value;
  axios.post(`${url}upload/file_upload/${file_type}`, function (res, req) {
    const file = document.getElementById("file").value;
    res.send(file);
  });
  alert("Upload successful! Thanks using Pi Webinars!");
}

function watch_again(webinarId, creatorId, categoryId) {
  var userId = creatorId;
  var file_id = webinarId;
  var collection_name = categoryId;
  axios.get(`${url}upload/${collection_name}/${userId}/${file_id}`);
}

function updatePostTitle(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const title = prompt("Enter new title:", "");
  axios.put(`${url}post/${userId}/${post_id}`, function (res, req) {
    res.send(title);
  });
}

function updatePostTitle(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const amount = prompt("Enter new price (Pi)", "");
  axios.put(`${url}post/${userId}/${post_id}`, function (res, req) {
    res.send(amount);
  });
}

function likePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`${url}post/like_unlike_post/${userId}/${post_id}`);
}

function dislikePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`${url}post/dislike_post/${userId}/${post_id}`);
}

function deletePost(webinarId) {
  const post_id = webinarId;
  axios.delete(`${url}post/${post_id}`);
}

function comment(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const text = prompt("Write your comment:", "");
  axios.put(`${url}post/${userId}/${post_id}`, function (res, req) {
    res.send(text);
  });
}

function likeComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.post(
    `${url}media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}`
  );
}

function updateComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Update Comment:", "");
  axios.put(
    `${url}post/${userId}/${post_id}/${comment_id}`,
    function (res, req) {
      res.send(text);
    }
  );
}

function replyComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Reply:", "");
  axios.post(
    `${url}post/comment/${userId}/${post_id}/${comment_id}`,
    function (res, req) {
      res.send(text);
    }
  );
}

function deleteComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.delete(`${url}post/comment/${userId}/${post_id}/${comment_id}`);
}

function likeCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.post(
    `${url}media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`
  );
}

function updateCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  const text = prompt("Update reply:", "");
  axios.put(
    `${url}media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`,
    function (res, req) {
      res.send(text);
    }
  );
}

function deleteCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.delete(
    `${url}media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`
  );
}

function sharePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`${url}share/${userId}/${post_id}`);
}

function deleteSharedPost(webinarId) {
  const post_id = webinarId;
  axios.post(`${url}share/${post_id}`);
}

//account routes
function logout() {
  axios.post(`${url}logout`);
}

function logoutAll() {
  axios.post(`${url}logout_all`);
}

function register() {
  const name = prompt('name', '');
  const userName = prompt('pi username', '')
  const password = prompt('create password', '');
  axios.post(`${url}register`, function (res, req) {
    res.send(name, userName, password);
  });
  alert(
    "Registration successful! You can now access your webinars at piwebinars.co.uk, outside the Pi Browser"
  );
}

function deleteAccount() {
  var r = confirm("Confirm Account Deletion");
  if (r == true) {
    axios.delete(`${url}profile`);
    alert("account deleted");
  } else {
    alert("account not deleted");
  }
}
