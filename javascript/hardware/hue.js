autowatch = 1;

// inlets and outlets
inlets = 2;
setinletassist(0, "message");
setinletassist(1, "response");

outlets = 2;
setoutletassist(0, "state");
setoutletassist(1, "request");


var baseUrl = undefined;
var deviceId = undefined;
var targetState = None;

// see https://kinsta.com/knowledgebase/javascript-http-request/


function init(deviceName, settingsFileName) {

   var settings = readJsonFile(settingsFileName);
   baseUrl = "http://" + settings["bridge"] + "/api/" + settings["username"] + "/";

   var initResponse = function () {

      if (request.status != 200)
         return;

      var response = JSON.parse(request.responseText);
      for (var key in response) {
         var device = response[key];
         if (device["name"] == deviceName)
            deviceId = key;
      }

      if (!deviceId)
         return;

      if (targetState != undefined) {
         if (targetState)
            on();
         else
            off();
         targetState == undefined;
      }
      state();

   }

   var request = new XMLHttpRequest();
   request.open("GET", baseUrl + 'lights');
   request.onreadystatechange = initResponse;
   request.send();
}

function state() {

   if (!deviceId)
      return;

   var request = new XMLHttpRequest();

   var stateResponse = function () {

      if (request.status != 200)
         return;

      var response = JSON.parse(request.responseText);
      var on = response["state"]["on"];
      outlet(0, on);
   }

   request.open("GET", baseUrl + 'lights/' + deviceId);
   request.onreadystatechange = stateResponse;
   request.send();
}

sendToBridge.local = 1;
function sendToBridge(payload) {

   if (!deviceId)
      return;

   var request = new XMLHttpRequest();

   var sendResponse = function () {
      if (request.status == 200)
         return;

      // print(request.responseText);
   }

   request.open("PUT", baseUrl + 'lights/' + deviceId + '/state');
   request.onreadystatechange = sendResponse;

   var content = JSON.stringify(payload);
   // print(content)
   request.send(content);
}

function on() {

   if (!deviceId) {
      targetState = true;
      return;
   }

   var payload = { "on": true };
   sendToBridge(payload);
}

function off() {

   if (!deviceId) {
      targetState = false;
      return;
   }

   var payload = { "on": false };
   sendToBridge(payload);
}

function color(hexColor) {

   hexColor = hexColor.substring(1);
   var color = new Color(hexColor);

   [hue, sat, bright] = color.toHSV();
   hue *= 256;

   var payload = { "hue": hue, "sat": sat, "transitiontime": 0, "alert": "none" };
   sendToBridge(payload);

}

function colorbright(hexColor) {

   hexColor = hexColor.substring(1);
   var color = new Color(hexColor);

   [hue, sat, bright] = color.toHSV();
   hue *= 256;

   var payload = { "hue": hue, "sat": sat, "bri": bright, "transitiontime": 0, "alert": "none" };
   sendToBridge(payload);
}

function brightness(value) {

   var payload = { "bri": value, "transitiontime": 0, "alert": "none" };
   sendToBridge(payload);
}
