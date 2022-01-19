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
      axios.post("https://server.piwebinars.co.uk/payment/cancel", function(res, req) {
        res.send(data);
      });
    }
    Pi.authenticate(scopes, onIncompletePaymentFound)
      .then(async function (auth) {
        const userName = auth.user.username;
        document.getElementById("username").innerHTML = userName;
        const userPassword = await prompt('create or enter your password', "");
        axios.post("https://server.piwebinars.co.uk/register", function (req, res) {
          res.send(userName, userPassword);
        })
        .catch(function (error) {
          console.error(error);
          alert('Please register to use our app');
          location.href = "/html/profile.html#register";
        });
      })
     .catch(err);
    } catch (error) {
      console.error(error);
  }
}
  
function buyWebinar(webinarId, creatorId, categoryId) {
  if (status == 'true') {
    const creditAmountJSON = axios.get("https://server.piwebinars.co.uk/profile");
    const creditAmount = JSON.parse(creditAmountJSON);
    const creditAvailable = creditAmount["credit"];
    const currentUser = creditAmount["user_id"];
    
    if (creditAvailable > 1) {
      axios.post("https://server.piwebinars.co.uk/payments/credit", async function(req, res) {
        await res.send(currentUser);
      });
    showWebinar(webinarId, creatorId, categoryId);
  } else {
  try {
   Pi.createPayment({
        amount: 1,
        memo: "Webinar Purchase",
        metadata: { webinarId }
}, {
  onReadyForServerApproval: function(paymentId) {           
    axios.post("https://server.piwebinars.co.uk/payment/approve", function(res, req) {
      res.send(paymentId);
          }); 
   },
  onReadyForServerCompletion: function(paymentId, txid) {
    const user_id = creatorId;
    axios.post("https://server.piwebinars.co.uk/payment/complete", function(res, req) {
      res.send(user_id, paymentId, txid);
    });
    showWebinar(webinarId, creatorId, categoryId);
    const profileCurrentUser2 = axios.get("https://server.piwebinars.co.uk/profile");
    const profileCurrentUser1 = JSON.parse(profileCurrentUser2);
    const profileCurrentUser = obj["profile"];
    const userId1 = profileCurrentUser[i].userId;
    axios.post(
      `https://server.piwebinars.co.uk/post/purchases/${userId1}/${categoryId}/${creatorId}/${webinarId}`
    );
  },
  onCancel: function(paymentId) { /* ... */ },
  onError: function(error, payment) { /* ... */ },
});
  } catch (error) {
    console.error(error);
    }
  }
  } else {
    alert('Payments are not availble until mainnet');
  }
};
  
function buyCredit() {
  var creditAmount = prompt('Amount:', '');
  if (status == 'true') {
  try {
    Pi.createPayment({
      amount: creditAmount,
      memo: `Buy ${creditAmount} credits`,
      metadata: { purchaseCredits }
}, {
  onReadyForServerApproval: function(paymentId) {           
    axios.post("https://server.piwebinars.co.uk/payment/approve", function(res, req) {
      res.send(paymentId);
          }); 
   },
  onReadyForServerCompletion: function(paymentId, txid) {
    axios.post("https://server.piwebinars.co.uk/payment/complete", function(res, req) {
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
};
  
function withdrawCredit() {
  alert('Payments are not availble until mainnet')
}
