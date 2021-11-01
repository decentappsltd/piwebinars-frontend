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
                          /*  return $.post( "https://latin-chain.com/server1.php", data).done(function(data) {
                                $(".button_click").prop( "disabled", false );
                            }).fail(function() {
                                $(".button_click").prop( "disabled", false );
                            }); */
                        }; // Read more about this in the SDK reference

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
                          // Amount of π to be paid:
                          amount: 1,
                          // An explanation of the payment - will be shown to the user:
                          memo: "Unlock Webinar", // e.g: "Digital kitten #1234",
                          // An arbitrary developer-provided metadata object - for your own usage:
                          metadata: { paymentType: "donation" /* ... */ }, // e.g: { kittenId: 1234 }
                        }, {
                          // Callbacks you need to implement - read more about those in the detailed docs linked below:
                          onReadyForServerApproval: function(paymentId) {
                              var data = {
                                        'action': 'approve',
                                        'paymentId': paymentId,
                                        'txid': '',
                                        'app_client': 'auth_example'
                                    };
                   /*           return $.post( "https://latin-chain.com/server1.php", data).done(function(data) {
                                    $(".button_click").prop( "disabled", false );
                                }).fail(function() {
                                    $(".button_click").prop( "disabled", false );
                                });  
                          },  */
                          onReadyForServerCompletion: function(paymentId, txid) {
                                var data = {
                                    'action': 'complete',
                                    'paymentId': paymentId,
                                    "txid": txid,
                                    'app_client': 'auth_example'
                                };
                            showWebinar(webinarId);
                /*                return $.post( "https://latin-chain.com/server1.php", data).done(function(data) {
                                    $(".button_click").prop( "disabled", false );
                                }).fail(function() {
                                    $(".button_click").prop( "disabled", false );
                                });  
                          },  */
                          onCancel: function(paymentId) { $(".button_click").prop( "disabled", false ); /* ... */ },
                          onError: function(error, payment) { $(".button_click").prop( "disabled", false ); /* ... */ },
                        });
                    } catch(err) {
                        $(".button_click").prop( "disabled", false );
                        alert(err);
                        // Technical problem (eg network failure). Please try again
                    }
                }

                auth();

            });
