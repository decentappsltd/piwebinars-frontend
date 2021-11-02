      const showWebinar = (id) => {
        const yt_frame = document.getElementById("youtube_frame");
        yt_frame.setAttribute("src", `https://www.youtube.com/embed/${id}`);
        yt_frame.style.display = "unset";
        dataLayer.push({'event': id});
        updatePurchasedVideos(id);
      }

      const updatePurchasedVideos = (videoId) => {
        var store = window.localStorage;
        store.setItem('last-purchase', videoId );
      }
     
            $( document ).ready(function() {
                const Pi = window.Pi;
                Pi.init({ version: "2.0" });
              
               $( ".button_click" ).click(function() {
                    transfer($(this).data('webinar-id'));
                });
              
                async function auth() {
                    try {
                        // Identify the user with their username / unique network-wide ID, and get permission to request payments from them.
                        const scopes = ['username', 'payments'];
                        function onIncompletePaymentFound(payment) {
                            
                            var data = {
                                    'action': 'complete',
                                    'paymentId': payment.identifier,
                                    'txid': payment.transaction.txid,
                                    'app_client': 'auth_example'
                                };
                              
                        };  // Read more about this in the SDK reference

                        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                          document.getElementById('username').innerHTML = auth.user.username;

                            //alert('Hello ' + auth.user.username);
                        }).catch(function(error) {
                          console.error(error);
                        });
                    } catch (err) {
                        alert(err);
                        // Not able to fetch the user
                    }
                }
                
                async function transfer(webinarId) {
                    try {
                        const payment = Pi.createPayment({
                          amount: 1,
                          memo: "Unlock Webinar",
                          metadata: { paymentType: "donation" }, 
                        }, {
                          onReadyForServerApproval: function(paymentId) {
                           //     var paymentId = 'paymentId';
                                fetch('https://api.minepi.com/v2/payments/'+paymentId+'/approve');
                          },  
                          onReadyForServerCompletion: function(paymentId) {
                            showWebinar(webinarId);
                                var paymentId = 'paymentId';
                                fetch('https://api.minepi.com/v2/payments/'+paymentId+'/complete');
                          },  
                          onCancel: function(paymentId) { $(".button_click").prop( "disabled", false ); },
                          onError: function(error, payment) { $(".button_click").prop( "disabled", false ); },
                        });
                    } catch(err) {
                        $(".button_click").prop( "disabled", false );
                        alert(err);
                    }
                }

                auth();

            });
