var secrets = require("./secrets")
var EDI = require('./');

var edi = new EDI({key: secrets.api_key, subscriptionKey: secrets.subscription_key});

edi.on('speechStart', function() {
  console.log('onSpeechStart');
});

edi.on('speechStop', function() {
  console.log('onSpeechStop');
});

edi.on('processFinished', function(){
  edi.recordVoice();
})

edi.on('speechReady', function() {
  // can do something here if you want.
});

edi.on('error', function(err) {
  console.log('onError:');
  console.log(err);
  edi.recordVoice();
});

edi.on('action', function(action){
  // every voice response emits an action. Pass these into your app to handle them.
});

edi.recordVoice();
