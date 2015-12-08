var secrets = require("./secrets");
var Request = require("superagent");
var EDI = require('./');
var Weather = require('./weather.js');

var edi = new EDI({key: secrets.api_key, subscriptionKey: secrets.subscription_key}, {threshold: 1});

function handleAction(action, data, restart){
  switch(action){
    case "getWeather":
        Weather.getWeather(data.result.parameters["geo-city"], secrets.weatherApiKey, Request, restart);
      break;
    default:
      restart();
      console.log("action not handled");
      break;
  }
}

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

edi.on('action', function(action, data, restart){
  console.log("ACTION", action)
  handleAction(action, data, restart);
  // every voice response emits an action. Pass these into your app to handle them.
});
console.log(process.argv);
if(process.argv.length && process.argv[2] == "quiet"){
  edi.startQuietMode();
} else {
  edi.recordVoice();
}
