//const axiosServer = axios.create({baseURL: 'https://server.piwebinars.co.uk', timeout: 20000});
//post routes
function createPost() {
  axios.post("https://server.piwebinars.co.uk/post", function(res, req) {
  const thumbnail = document.getElementById('thumbnail').value;
  const collection_name = document.getElementById('catagory').value;
  const amount = document.getElementById('price').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  res.send(title, description, thumbnail, collection_name, amount)
  });
  const file_type = document.getElementById('file_type').value
  axios.post(`https://server.piwebinars.co.uk/upload/file_upload/${file_type}`, function(res, req) {
    const file = document.getElementById('file').value;
    res.send(file)
  });
  alert('Upload successful! Thanks using Pi Webinars!');
};

function watch_again(webinarId, creatorId, categoryId) {
  var userId = creatorId;
  var file_id = webinarId;
  var collection_name = categoryId;
  axios.get(`https://server.piwebinars.co.uk/upload/${collection_name}/${userId}/${file_id}`);
}

function updatePostTitle(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const title = prompt("Enter new title:", "");
  axios.put(`https://server.piwebinars.co.uk/post/${userId}/${post_id}`, function(res, req) {
    res.send(title)
  });
}

function updatePostTitle(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const amount = prompt("Enter new price (Pi)", ""); 
  axios.put(`https://server.piwebinars.co.uk/post/${userId}/${post_id}`, function(res, req) {
    res.send(amount)
  });
}

function likePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`https://server.piwebinars.co.uk/post/like_unlike_post/${userId}/${post_id}`);
}

function dislikePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`https://server.piwebinars.co.uk/post/dislike_post/${userId}/${post_id}`);
}

function deletePost(webinarId) {
  const post_id = webinarId;
  axios.delete(`https://server.piwebinars.co.uk/post/${post_id}`);
}

function comment(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const text = prompt("Write your comment:", "");
  axios.put(`https://server.piwebinars.co.uk/post/${userId}/${post_id}`, function(res, req) {
    res.send(text);
  });
}

function likeComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.post(`https://server.piwebinars.co.uk/media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}`);
}

function updateComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Update Comment:", "");
  axios.put(`https://server.piwebinars.co.uk/post/${userId}/${post_id}/${comment_id}`, function(res, req) {
    res.send(text);
  });
}

function replyComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Reply:", "");
  axios.post(`https://server.piwebinars.co.uk/post/comment/${userId}/${post_id}/${comment_id}`, function(res, req) {
    res.send(text);
  });
}

function deleteComment(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.delete(`https://server.piwebinars.co.uk/post/comment/${userId}/${post_id}/${comment_id}`);
}

function likeCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.post(`https://server.piwebinars.co.uk/media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`);
}

function updateCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  const text = prompt("Update reply:", "");
  axios.put(`https://server.piwebinars.co.uk/media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`, function(res, req) {
    res.send(text);
  });
}

function deleteCommentReply(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.delete(`https://server.piwebinars.co.uk/media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`);
}

function sharePost(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`https://server.piwebinars.co.uk/share/${userId}/${post_id}`);
}

function deleteSharedPost(webinarId) {
  const post_id = webinarId;
  axios.post(`https://server.piwebinars.co.uk/share/${post_id}`);
}

//account routes
function logout() {
  axios.post('https://server.piwebinars.co.uk/logout');
}

function logoutAll() {
  axios.post('https://server.piwebinars.co.uk/logout_all');
}
  
function register() {
  const userName = document.getElementById('pi_username');
  const password = document.getElementById('user_password');
  axios.post('https://server.piwebinars.co.uk/register', function (res, req) {
    res.send(userName, password);
  });
  alert('Registration successfull! You can now access your webinars at piwebinars.co.uk, outside the Pi Browser');
}

function deleteAccount() {
    var r = confirm("Confirm Accout Deletion");
  if (r == true) {
    axios.delete('https://server.piwebinars.co.uk/profile');
    alert("account deleted");
  } else {
    alert("account not deleted");
  }
}