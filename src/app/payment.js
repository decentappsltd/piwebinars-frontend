import axios from 'axios';

const serverURL = 'https://piwebinars-server.onrender.com';

async function auth() {
  const scopes = ["username", "payments"];
  function onIncompletePaymentFound(payment) {
    var data = {
      paymentId: payment.identifier,
      txid: payment.transaction.txid,
    };
    axios.post(
      `${serverURL}/payment/incomplete`,
      data
    );
  }
  window.Pi.authenticate(scopes, onIncompletePaymentFound).then(async function (auth) {
    const userName = auth.user.username;
    const uid = auth.user.uid;
    localStorage.uid = uid;
    localStorage.piName = userName;
    localStorage.piAccessToken = auth.accessToken;
    piLogin();
  });
}

// saving arrays to session storage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

async function piLogin() {
  const config = {
    name: localStorage.piName,
    username: localStorage.piName,
    uid: localStorage.uid,
  };
  const response = await axios.post(
    `${serverURL}/login/pi`,
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
    sessionStorage.setObj('profile', response.data.profile);
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
  }
  if (response.status === 201) {
    alert("Welcome to Pi Webinars!");
  }
}

auth();

function buyWebinar(post) {
  const { user_id, post_id, videoId, amount, title } = post;
  const price = amount;
  const userId = user_id;
  const Tkn = localStorage.getItem("userSession");
  console.log(userId, post_id, videoId, price, title);
  if (navigator.userAgent.toLowerCase().indexOf("pibrowser") < 0) {
    alert("Please go to the Pi Browser to make a crypto payment");
    window.open("pi://www.piwebinars.co.uk");
  }
  if (!localStorage.userSession) {
    alert("Please login to purchase a webinar!");
    return null;
  }
  const username = sessionStorage.username;

  const payment = window.Pi.createPayment(
    {
      amount: price,
      memo: "Purchase Full Webinar",
      metadata: { paymentType: "webinar_purchase" },
    },
    {
      onReadyForServerApproval: function (paymentId) {
        var data = {
          paymentId: paymentId,
          txid: "",
        };
        axios.post(
          `${serverURL}/payment/approve`,
          data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tkn}`
          },
          withCredentials: true,
          credentials: "same-origin"
        }
        );
      },
      onReadyForServerCompletion: async function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
          username: username,
          userId: userId,
          post_id: post_id,
          videoId: videoId,
          title: title,
          price: price,
        };
        const response = await axios.post(
          `${serverURL}/payment/complete`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Tkn}`,
            },
            withCredentials: true,
            credentials: "same-origin",
          }
        ).catch((err) => {
          console.log(err);
          alert('Payment failed, please contact customer service at support@piwebinars.app');
        });
        if (response.data.success == true) {
          alert('Thank you for purchasing a webinar, you may now watch it in your purchases page. Enjoy!');
          // window.location.reload();
        } else alert('Payment failed, please contact customer service at support@piwebinars.app');
        return response;
      },
      onCancel: function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
        };
        axios.post(
          `${serverURL}/payment/incomplete`,
          data
        );
      },
      onError: function (paymentId, txid) {
        var data = {
          paymentId: paymentId,
          txid: txid,
        };
        axios.post(
          `${serverURL}/payment/incomplete`,
          data
        );
      },
    }
  );
}

export { buyWebinar };