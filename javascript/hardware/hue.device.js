autowatch = 1;

// inlets and outlets
inlets = 2;
setinletassist(0, "message");
setinletassist(1, "response");

outlets = 2;
setoutletassist(0, "state");
setoutletassist(1, "request");

var initRequest = new XMLHttpRequest();
var stateRequest = new XMLHttpRequest();
var sendRequest = new XMLHttpRequest();

var baseUrl = undefined;
var deviceId = undefined;
var deviceName = undefined;

var sendQueue = {};
var sendTask = new Task(processQueue);
sendTask.interval = 10;
sendTask.repeat();

var stateTask = new Task(state);
stateTask.interval = 5000;
stateTask.repeat();

// see https://kinsta.com/knowledgebase/javascript-http-request/


function init(_deviceName, settingsFileName) {

   deviceName = _deviceName;
   initRequest.onreadystatechange = initResponse;
   stateRequest.onreadystatechange = stateResponse;
   sendRequest.onreadystatechange = sendResponse;

   var settings = readJsonFile(settingsFileName);
   baseUrl = "http://" + settings["bridge"] + "/api/" + settings["username"] + "/";

   initRequest.open("GET", baseUrl + 'lights');
   initRequest.send();
}



function on() {

   var payload = { "on": true };
   addToQueue('state', payload);
}

function off() {

   var payload = { "on": false };
   addToQueue('stae', payload);
}

function color(hexColor) {

   var color = new Color(hexColor);

   [hue, sat, bright] = color.toHSV();
   hue *= 256;

   var payload = { "hue": hue, "sat": sat, "transitiontime": 0, "alert": "none" };
   addToQueue('color', payload);
}

function colorbright(hexColor) {

   var color = new Color(hexColor);

   [hue, sat, bright] = color.toHSV();
   hue *= 256;

   var payload = { "hue": hue, "sat": sat, "bri": bright, "transitiontime": 0, "alert": "none" };
   addToQueue('colorbright', payload);
}

function brightness(value) {

   var payload = { "bri": value, "transitiontime": 0, "alert": "none" };
   addToQueue('bright', payload);
}

initResponse.local = 1;
function initResponse() {

   if (initRequest.status != 200)
      return;

   var response = JSON.parse(initRequest.responseText);
   for (var key in response) {
      var device = response[key];
      if (device["name"] == deviceName)
         deviceId = key;
   }
}

state.local = 1;
function state() {

   if (!deviceId)
      return;

   stateRequest.open("GET", baseUrl + 'lights/' + deviceId);
   stateRequest.send();
}

stateResponse.local = 1;
function stateResponse() {

   if (stateRequest.status != 200)
      return;

   var response = JSON.parse(stateRequest.responseText);
   var on = response["state"]["on"];
   outlet(0, on);
}

sendToBridge.local = 1;
function sendToBridge(payload) {

   if (!deviceId)
      return;

   sendRequest.open("PUT", baseUrl + 'lights/' + deviceId + '/state');

   var content = JSON.stringify(payload);
   // print(content)
   sendRequest.send(content);
}

sendResponse.local = 1;
function sendResponse() {

   if (sendRequest.status == 200)
      return;

   print(sendRequest.responseText);
}

processQueue.local = 1;
function processQueue() {

   for (var key in sendQueue) {

      payload = sendQueue[key];
      if (!payload)
         continue;

      sendQueue[key] = undefined;
      sendToBridge(payload);
   }

}

addToQueue.local = 1;
function addToQueue(key, payload) {

   sendQueue[key] = payload;
}
