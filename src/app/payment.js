import axios from 'axios';

async function auth() {
  alert("Pi auth");
  const scopes = ["username", "payments"];
  function onIncompletePaymentFound(payment) {
    var data = {
      paymentId: payment.identifier,
      txid: payment.transaction.txid,
    };
    axios.post(
      "https://piwebinars-server.onrender.com/payment/incomplete",
      data
    );
  }
  window.Pi.authenticate(scopes, onIncompletePaymentFound).then(async function (auth) {
    const userName = auth.user.username;
    const uid = auth.user.uid;
    alert(uid);
    localStorage.uid = uid;
    localStorage.piName = userName;
    localStorage.piAccessToken = auth.accessToken;
    // if (!sessionStorage.userSession) {
      piLogin();
    // }
  });
}

async function piLogin() {
  alert(localStorage.uid);
    const config = {
      name: localStorage.piName,
      username: localStorage.piName,
      uid: localStorage.uid,
      // piAccessToken: localStorage.piAccessToken,
    };
    const response = await axios.post(
      `https://piwebinarsdev.herokuapp.com/login/pi`,
      config
    );
    if (response.status === 200 || response.status === 201) {
      const token = response.data.token;
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("userSession");
      sessionStorage.setItem("userSession", token);
      localStorage.setItem("userSession", token);
      sessionStorage.setItem("username", localStorage.piName);
      localStorage.setItem("user", response.data.userId);
      document.getElementById("login").style.display = "none";
      document.getElementById("register").style.display = "none";
    }
    if (response.status === 201) {
      alert("Welcome to Pi Webinars!");
    }
}

auth();

function buyWebinar(post) {
  const { user_id, post_id, video_id, amount, title } = post;
  const price = amount;
  const userId = user_id;
  console.log(userId, post_id, video_id, price, title);
  if (navigator.userAgent.toLowerCase().indexOf("pibrowser") < 0) {
    alert("Please go to the Pi Browser to make a crypto payment");
    window.open("pi://www.piwebinars.co.uk");
  }
  if (!localStorage.userSession) {
    alert("Please login to purchase a webinar!");
    return null;
  }
  const username = sessionStorage.username;
  const url = "https://player.vimeo.com/video/" + video_id;

  const payment = window.Pi.createPayment(
    {
      amount: price,
      memo: "Buy Webinar",
      metadata: { paymentType: "webinar_purchase" },
    },
    {
      onReadyForServerApproval: function (paymentId) {
        var data = {
          paymentId: paymentId,
          txid: "",
        };
        axios.post(
          "https://piwebinars-server.onrender.com/payment/approve",
          data
        );
      },
      onReadyForServerCompletion: async function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
          username: username,
          userId: userId,
          post_id: post_id,
          url: url,
          title: title,
          price: price,
        };
        const authToken = localStorage.getItem("userSession");
        const response = await axios.post(
          "https://piwebinars-server.onrender.com/payment/complete",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
            credentials: "same-origin",
          }
        );
        return response;
      },
      onCancel: function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
        };
        axios.post(
          "https://piwebinars-server.onrender.com/payment/incomplete",
          data
        );
      },
      onError: function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
        };
        axios.post(
          "https://piwebinars-server.onrender.com/payment/incomplete",
          data
        );
      },
    }
  );
}

export { buyWebinar };