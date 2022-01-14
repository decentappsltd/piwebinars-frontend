$(document).ready(function () {
  const Pi = window.Pi;
  Pi.init({ version: "2.0" });
  
  const status = 'false';

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
    } catch (error) {
      console.error(error);
    }
  }
  
  auth();

$(".button_click").click(function(webinarId, creatorId, categoryId) {
  if (status == 'true') {
  try {
   Pi.createPayment({
        amount: 1,
        memo: "Webinar Purchase",
        metadata: { webinarId }
}, {
  onReadyForServerApproval: function(paymentId) {           
    axios.post("/payment/approve", function(res, req) {
      res.send(paymentId);
          }); 
   },
  onReadyForServerCompletion: function(paymentId, txid) {
    const user_id = creatorId;
    axios.post("/payment/complete", function(res, req) {
      res.send(user_id, paymentId, txid);
    });
    showWebinar(webinarId, creatorId, categoryId);
    const profileCurrentUser2 = axios.get("/profile");
    const profileCurrentUser1 = JSON.parse(profileCurrentUser2);
    const profileCurrentUser = obj["profile"];
    const userId1 = profileCurrentUser[i].userId;
    axios.post(
      `/post/purchases/${userId1}/${categoryId}/${creatorId}/${webinarId}`
    );
  },
  onCancel: function(paymentId) { /* ... */ },
  onError: function(error, payment) { /* ... */ },
});
  } catch (error) {
    console.error(error);
    }
  } else {
    alert('Payments are not availble until mainnet');
  }
});
  
  $(".buyCredit").click(function() {
    var creditAmount = prompt('Amount:', '');
    if (status == 'true') {
    try {
      Pi.createPayment({
        amount: creditAmount,
        memo: `Buy ${creditAmount} credits`,
        metadata: { purchaseCredits }
}, {
  onReadyForServerApproval: function(paymentId) {           
    axios.post("/payment/approve", function(res, req) {
      res.send(paymentId);
          }); 
   },
  onReadyForServerCompletion: function(paymentId, txid) {
    axios.post("/payment/complete", function(res, req) {
      res.send(paymentId, txid);
      buyCredits(creditAmount);
    });
  },
  onCancel: function(paymentId) { /* ... */ },
  onError: function(error, payment) { /* ... */ },
});
  } catch (error) {
    console.error(error);
  }
    } else {
      alert('Payments are not available until mainnet');
    }
});
  
  $(".withdrawCredit").click(function() {
    alert('Payments are not availble until mainnet')
  })
  
});

const showWebinar = (webinarId, creatorId, categoryId) => {
  var userId = creatorId;
  var file_id = webinarId;
  var collection_name = categoryId;
  const purchasedWebinarJSON = axios.get(
    `/upload/${collection_name}/${userId}/${file_id}`
  );
  const purchasedWebinar = JSON.parse(purchasedWebinarJSON);
  const currentWebinar = purchasedWebinar["upload"];
  document.getElementById('modal1').classList.add('isVisible');
  document.getElementById("usersPurchase").src = currentWebinar[i].file;
  renderComments(purchasedWebinar);
  document.getElementById("followCreator").onclick = function() {
    axios.post(`/auth_follow_unfollow/${userId}`)
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
      var commentId = currentComments[i].comment_  };
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
    axios.post(
      `/profile/credit`, function(res, req) {
        res.send(creditAmount);
      }
    );
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

function showMore(featured, webinars) {
  var x = featured.length;
  var feature = webinars.slice(0, x+20);
}

function googleTranslate() {
  document.getElementById('google_translate_element').style.display = "block";
  document.getElementById('translate').style.display = "none";
}

function searchWebinars() {
  var results = [];
  var searchField = document.querySelector('#search');
  for (var i=0 ; i < obj.list.length ; i++) {
    if (obj.list[i][searchField] == searchVal) {
      results.push(obj.list[i]);
    }
  }
}
