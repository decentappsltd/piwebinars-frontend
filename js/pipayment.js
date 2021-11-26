$( document ).ready(function() {
                const Pi = window.Pi;
                Pi.init({ version: "2.0" });
              
               $( ".button_click" ).click(function() {
                    transfer($(this).data('webinar-id'));
                });
              
                async function auth() {
                    try {
                        const scopes = ['username', 'payments'];
                        function onIncompletePaymentFound(payment) {
                            
                            var data = {
                                    'action': 'complete',
                                    'paymentId': payment.identifier,
                                    'txid': payment.transaction.txid,
                                    'app_client': 'auth_example'
                                };
                          axios.post('/cancel', data);
                        };

                        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                          const userName = auth.user.username;
                          document.getElementById('username').innerHTML = userName;
                          app.post('/register/:userName', function (req, res) {
                            res.send(userName)
                          }).catch(function() {
                              axios.post('/login', function(res, req) {
                                res.send(userName)
                          });
                        }).catch(function(error) {
                          console.error(error);
                        });
                    }).catch(err)
                    
                }catch {
                  alert('Please go to Pi Browser')
                }
                }
});

async function transfer(webinarId, creatorId, categoryId) {
  try {
    const payment = Pi.createPayment({
      amount: 1,
      memo: "Webinar Purchase",
      metadata: { webinarId }
    }, {
      onReadyForServerApproval: function(paymentId) {
        var data = {
          'paymentId': paymentId,
          'txid': '',
        }
        axios.post('/approve', data)
      },
      onReadyForServerCompletion: function(paymentId, txid) {
        var data = {
          'paymentId': paymentId,
          'txid': txid,
        }
        axios.post('/complete', data);
        showWebinar(webinarId, creatorId, categoryId);
      },
    })
  }catch(err) {
    alert(err);
  }
};
  
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
                  
function renderComments(purchasedWebinar) {
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
