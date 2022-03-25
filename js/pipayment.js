async function auth() {
    const scopes = ["username", "payments"];
    function onIncompletePaymentFound(payment) {
      var data = {
        paymentId: payment.identifier,
        txid: payment.transaction.txid,
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/incomplete", data);
    }
    Pi.authenticate(scopes, onIncompletePaymentFound)
      .then(async function (auth) {
        const userName = auth.user.username;
        document.getElementById("username").innerHTML = userName;
      })
    }

auth();

function buyWebinar() {
  const collection_id = "video";
  const userId = localStorage.getItem("user_id");
  const file_id = localStorage.getItem("post_id");
  const price = localStorage.getItem("price");
  
  const payment = Pi.createPayment(
  {
    amount: price,
    memo: "testing",
    metadata: { paymentType: "testing" }
  },
  {
    onReadyForServerApproval: function (paymentId) {
      var data = {
        paymentId: paymentId,
        txid: "",
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/approve", data)
    },
    onReadyForServerCompletion: function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid,
        collection_id: collection_id,
        userId: userId,
        file_id: file_id,
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/complete", data)
      showWebinar();
    },
    onCancel: function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid,
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/incomplete", data);
    },
    onError: function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid,
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/incomplete", data);
    }
  }
);
}