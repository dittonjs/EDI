# EDI

## Description

**EDI** is an Enhanced Desktop Intelligence module for node.js using api.ai.

**EDI** will listen for your commands and and send wav recording to api.ai which return with an and speech that you can use to help your app make decisions.

## Setup

You must register for an account at api.ai. Follow their instructions on creating and app becuase they
could explain it much better than I could.

Add a new file called secrets.js and copy secrets.example.js into it. Then fill in the info with the
keys given to you by api.ai.

You must install sox 'Sound eXchange' inorder to use **EDI**.

This can be easily done using Homebrew on Mac. `brew install sox`
If you are on linux you probably already know how to do that.
If you are on windows you should buy a mac because this won't work on windows. 

## Example usage (node example.js)

```javascript
var secrets = require("./secrets") // use the secrets to get your api key and subscription key
// var EDI = require('EDI'); if you are using this as a node module.
var EDI = require('./');
```

Currently the only language supported is english but others will be added in the future.

```javascript
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

edi.recordVoice(); // use the record voice function to start listening 
// by defualt EDI takes a one word query before it will start recording and will say 'yes'
// when it is ready to listen.
```

## Comming Up

A quite mode so you can interact with **EDI** via a keyboard and it will respond with text instead of voice.
