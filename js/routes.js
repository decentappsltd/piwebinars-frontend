//import axios from 'https://olivercrockett.github.io/testrepo/node_modules/axios';
//const axiosServer = axios.create({baseURL: 'https://server.piwebinars.co.uk', timeout: 20000});

$(document).ready(function(){

//post routes
$(".createPost").click(function() {
  axios.post("/post", function(res, req) {
  const thumbnail = document.getElementById('thumbnail').value;
  const collection_name = document.getElementById('catagory').value;
  const amount = document.getElementById('price').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  res.send(title, description, thumbnail, collection_name, amount)
  });
  const file_type = document.getElementById('file_type').value
  axios.post(`/upload/file_upload/${file_type}`, function(res, req) {
    const file = document.getElementById('file').value;
    res.send(file)
  });
  alert('Upload successful! Thanks using Pi Webinars!');
});

$(".watch_again").click(function(webinarId, creatorId, categoryId) {
  var userId = creatorId;
  var file_id = webinarId;
  var collection_name = categoryId;
  axios.get(`/upload/${collection_name}/${userId}/${file_id}`);
})

$(".updatePostTitle").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const title = prompt("Enter new title:", "");
  axios.put(`/post/${userId}/${post_id}`, function(res, req) {
    res.send(title)
  })
})

$(".updatePostAmount").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const amount = prompt("Enter new price (Pi)", ""); 
  axios.put(`/post/${userId}/${post_id}`, function(res, req) {
    res.send(amount)
  })
})

$(".likePost").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`/post/like_unlike_post/${userId}/${post_id}`);
});

$(".dislikePost").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`/post/dislike_post/${userId}/${post_id}`);
});

$(".deletePost").click(function(webinarId) {
  const post_id = webinarId;
  axios.delete(`/post/${post_id}`);
});

$(".comment").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  const text = prompt("Write your comment:", "");
  axios.put(`/post/${userId}/${post_id}`, function(res, req) {
    res.send(text)
  })
})

$(".likeComment").click(function(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.post(`/media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}`)
})

$(".updateComment").click(function(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Update Comment:", "");
  axios.put(`/post/${userId}/${post_id}/${comment_id}`, function(res, req) {
    res.send(text)
  })
})

$(".replyComment").click(function(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const text = prompt("Reply:", "");
  axios.post(`/post/comment/${userId}/${post_id}/${comment_id}`, function(res, req) {
    res.send(text)
  })
})

$(".deleteComment").click(function(webinarId, creatorId, commentId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  axios.delete(`/post/comment/${userId}/${post_id}/${comment_id}`)
})

$(".likeCommentReply").click(function(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.post(`/media/post/like_unlike_comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`)
})

$(".updateCommentReply").click(function(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  const text = prompt("Update reply:", "");
  axios.put(`api/media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`, function(res, req) {
    res.send(text)
  })
})

$(".deleteCommentReply").click(function(webinarId, creatorId, commentId, commentReplyId) {
  const post_id = webinarId;
  const userId = creatorId;
  const comment_id = commentId;
  const comment_reply_id = commentReplyId;
  axios.delete(`api/media/posts/comment/${userId}/${post_id}/${comment_id}/${comment_reply_id}`)
})

$(".sharePost").click(function(webinarId, creatorId) {
  const post_id = webinarId;
  const userId = creatorId;
  axios.post(`/share/${userId}/${post_id}`)
})

$(".deleteSharedPost").click(function(webinarId) {
  const post_id = webinarId;
  axios.post(`/share/${post_id}`)
})

//account routes
$(".logout").click(function() {
  axios.post('/logout')
})

$(".logoutAll").click(function() {
  axios.post('/logout_all')
})
  
$(".register").click(function() {
  const userName = document.getElementById('pi_username');
  const password = document.getElementById('user_password');
  axios.post('/register', function (res, req) {
    res.send(userName, password);
  });
  alert('Registration successfull! You can now access your webinars at piwebinars.co.uk, outside the Pi Browser');
})

$(".deleteAccount").click(function() {
    var r = confirm("Confirm Accout Deletion");
  if (r == true) {
    axios.delete('/profile')
    alert("account deleted");
  } else {
    alert("account not deleted");
  }
})
  
});