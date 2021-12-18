$(document).ready(function () {
  const Pi = window.Pi;
  Pi.init({ version: "2.0" });

  async function auth() {
    try {
      const scopes = ["username", "payments"];
      function onIncompletePaymentFound(payment) {
        var data = {
          action: "complete",
          paymentId: payment.identifier,
          txid: payment.transaction.txid,
        };
        axios.post("/payment/cancel", function(res, req) {
          res.send(data);
        });
      }

      Pi.authenticate(scopes, onIncompletePaymentFound)
        .then(async function (auth) {
          const userName = auth.user.username;
          document.getElementById("username").innerHTML = userName;
          const userPassword = await prompt('create or enter your password', "");
          axios.post("/register", function (req, res) {
              res.send(userName, userPassword);
            })
            .catch(function (error) {
              console.error(error);
            });
        })
        .catch(err);
    }
  }

$(".button_click").click(function (webinarId, creatorId, categoryId) {
  try {
    const payment = Pi.createPayment(
      {
        amount: 1,
        memo: "Webinar Purchase",
        metadata: { webinarId }
      },
      {
        onReadyForServerApproval: function (paymentId) {
          const paymentId = payment.identifier;
          axios.post("/payment/approve", function(res, req) {
            res.send(paymentId);
          });
        },
        onReadyForServerCompletion: function (paymentId, txid) {
          const paymentId = payment.identifier;
          const txid = payment.transaction.txid;
          const user_id = creatorId;
          axios.post("/payment/complete", function(res, req) {
            res.send(user_id, paymentId, txid);
          });
          showWebinar(webinarId, creatorId, categoryId);
        }
      }
    );
  } catch (err) {
    alert(err);
  }
});
});
  
  const showWebinar = (webinarId, creatorId, categoryId) => {
    var userId = creatorId;
    var file_id = webinarId;
    var collection_name = categoryId;
    const purchasedWebinarJSON = axios.get(`/upload/${collection_name}/${userId}/${file_id}`);
    const purchasedWebinar = JSON.parse(purchasedWebinarJSON);
    const currentWebinar = purchasedWebinar['members'];
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
    document.getElementById('usersPurchase').src = currentWebinar[i].file;
    renderComments(purchasedWebinar);
    const profileCurrentUser2 = axios.get('/profile');
    const profileCurrentUser1 = JSON.parse(profileCurrentUser2);
    const profileCurrentUser = obj['members'];
    const userId1 = profileCurrentUser[i].userId;
    axios.post(`/post/purchases/${userId1}/${collection_name}/${userId}/${file_id}`);
  };
                  ion renderComments(purchasedWebinar) {
  const currentComments = purchasedWebinar['members'];
  const commentDiv = document.getElementById('comments');
  for (let i = 0; i < currentComments.length; i++) {
  const renderMessage = document.createElement('p3');
  const renderCommentLikes = document.createElement('h6');
  const renderLikeButton = document.createElement('button');
  renderLikeButton.className = "likeComment";
  renderLikeButton.onclick = function () {
      var webinarId = currentComments[i].post_id;
      var creatorId = currentComments[i].userId;
      var commentId = currentComments[i].comment_id;
};
  const renderReplyButton = document.createElement('button');
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
};
};

     function openCinema() {
document.getElementById("modal1").classList.add("is-visible");
};

function closeCinema() {
  document.getElementById("modal1").classList.remove("is-visible");
}

     function openUploadPage() {
document.getElementById("modal2").classList.add("is-visible");
};

function closeUploadPage() {
  document.getElementById("modal2").classList.remove("is-visible");
}
