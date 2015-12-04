var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    spawn = require('child_process').spawn,
    exec    = require('child_process').exec

// EDI
var EDI = function EDI(credentials, options) {
  EventEmitter.call(this);
  console.log(credentials);
  options = options || {}

  this.recBuffer = [];
  this.isRecording = false;
  this.apiKey = credentials.key;
  this.subscriptionKey = credentials.subscriptionKey;
  this.sessionId = credentials.sessionId;
  this.recCmd = "rec";
  this.recCmdArgs = [
    '-r', "16000",'-b', '16', '-c', '1', 'record_voice.wav'
  ];
  this.soxCmd = 'sox';
  this.soxCmdArgs = [
    '-q',
    '-b','16',
    '-d','-t','raw','-',
    'rate','16000','channels','1',
    'silence','1','0.1',(options.threshold || '1')+'%','1','1.0',(options.threshold || '1')+'%'
  ];
  this.cUrlCmd = "curl";
  this.cUrlCmdArgs = [
    '-k', '-F', '"request={\'timezone\':\'America/New_York\', \'lang\':\'en\'};type=application/json"',
    '-F', '"voiceData=@record_voice.wav;type=audio/wav', '-H', '"Authorization: Bearer '+this.apiKey+'"', '-H', '"ocp-apim-subscription-key:'+this.subscriptionKey+'"',
    '"https://api.api.ai/v1/query?v=20150910"'
  ];
};

util.inherits(EDI, EventEmitter);
module.exports = EDI;

EDI.prototype.sendVoiceRecording = function() {
  //spawn('say', ["One moment please."]);  
  var self = this;
  var cmd = "curl -k -F \"request={'timezone':'America/New_York', 'lang':'en'};type=application/json\" -F \"voiceData=@record_voice.wav;type=audio/wav\" -H \"Authorization: Bearer "+self.apiKey+"\" -H \"ocp-apim-subscription-key: "+self.subscriptionKey+"\" \"https://api.api.ai/v1/query?v=20150910\"";
  setTimeout(function(){
    var command = exec(cmd, function(error, stdout, stderr){
      console.log(stdout);
      var data;
      try {
        data = JSON.parse(stdout);
        if(data.status.errorType == "bad_request"){
          var edi = spawn('say', ["I'm sorry I didn't get that."]);
          edi.on('close', function(){
            self.emit("processFinished")
          });
          return;
        }
        exec("echo \"YOU: "+data.result.resolvedQuery+"\n\" >> history.txt", function(){});
        exec("echo \"EDI: "+data.result.fulfillment.speech+"\n\" >> history.txt", function(){});
        var edi = spawn('say', [data.result.fulfillment.speech]);
        edi.on('close', function(){
          self.emit("processFinished")
          self.emit("action", data.action)
        });
      } catch(e){
        console.log(e);
      }
    });
  }, 1000)

};

EDI.prototype.recordVoice = function() {
  var self = this;

  var soxRec = spawn(self.soxCmd, self.soxCmdArgs, 'pipe');
  var rec;
  var post;
  // Process stdout

  soxRec.stdout.on('readable', function() {
    self.emit('speechReady');
  });

  soxRec.stdout.setEncoding('binary');
  soxRec.stdout.on('data', function(data) {
    if(! self.isRecording) {
      self.emit('speechStart');
      self.isRecording = true;
      var edi = spawn('say', ['yes?']);
      edi.on('close', function(code){
        setTimeout(function(){rec = spawn(self.recCmd, self.recCmdArgs, 'pipe');}, 100);
      });
    }
  });

  // Process stdin

  soxRec.stderr.setEncoding('utf8');
  soxRec.stderr.on('data', function(data) {
    console.log(data)
  });

  soxRec.on('close', function(code) {
    self.isRecording = false;
    if(code) {
      self.emit('error', 'sox exited with code ' + code);
    }
    if(!rec){
      self.emit('speechStop');
      return;
    }
    self.emit('speechStop');
    self.sendVoiceRecording();
  });
};


