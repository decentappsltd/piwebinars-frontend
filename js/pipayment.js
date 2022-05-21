async function auth() {
  const scopes = ["username", "payments"];
  function onIncompletePaymentFound(payment) {
    var data = {
      paymentId: payment.identifier,
      txid: payment.transaction.txid
    };
    axios.post(
      "https://piwebinars-server.herokuapp.com/payment/incomplete",
      data
    );
  }
  Pi.authenticate(scopes, onIncompletePaymentFound).then(async function (auth) {
    const userName = auth.user.username;
    const uid = auth.user.uid;
    localStorage.uid = uid;
    localStorage.piName = userName;
    if (!sessionStorage.userSession) {
      piLogin();
    }
  });
}

async function piLogin() {
  try {
    const config = {
      name: localStorage.piName,
      username: localStorage.piName,
      uid: localStorage.uid
    };
    const response = await axios.post(
      `https://piwebinars-server.herokuapp.com/login/pi`,
      config
    );
    if (response.status === 200 || response.status === 201) {
      const token = response.data.token;
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("userSession");
      sessionStorage.setItem("userSession", token);
      localStorage.setItem("userSession", token);
      sessionStorage.setItem("username", localStorage.piName);
      // show logged in
      authNavv.forEach((elem) => {
        elem.classList.remove("authNav");
        elem.classList.add("showNav");
      });
      unAuthNavv.forEach((elem) => {
        elem.style.display = "none";
      });
    }
    if (response.status === 201) {
      alert("Welcome to Pi Webinars!");
    }
  } catch (error) {
    console.log(error);
  }
}

auth();

function buyWebinar() {
  if ( navigator.userAgent.toLowerCase().indexOf("pibrowser")<0 ) {
    alert("Please go to the Pi Browser to make a crypto payment");
    window.open("pi://www.piwebinars.co.uk");
  }
  const userId = localStorage.getItem("user_id");
  const post_id = localStorage.getItem("post_id");
  const price = localStorage.getItem("amount");
  const username = sessionStorage.username;
  const title = localStorage.webinarTitle;
  const url = "https://player.vimeo.com/video/"+localStorage.video_id;
  
  const payment = Pi.createPayment(
  {
    amount: price,
    memo: "Buy Webinar",
    metadata: { paymentType: "webinar_purchase" }
  },
  {
    onReadyForServerApproval: function (paymentId) {
      var data = {
        paymentId: paymentId,
        txid: "",
      };
      axios.post("https://piwebinars-server.herokuapp.com/payment/approve", data)
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
      const response = await axios.post("https://piwebinars-server.herokuapp.com/payment/complete", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
      credentials: "same-origin",
    })
      showWebinar(response);
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
