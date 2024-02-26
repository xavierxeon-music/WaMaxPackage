autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "reset/state");

outlets = 1;
setoutletassist(0, "json");
setoutletassist(1, "devices");

/////////////////////////////
// vars / setup

var hue = new Global("hue");
if (!hue.stateChange)
   hue.stateChange = {};


var stateDict = new Dict("hue_state");
var deviceMap = {};
var stackMap = {};

var sendTask = new Task(sendStack);
sendTask.interval = 100;
sendTask.repeat();

/////////////////////////////
// hue function

// see https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put

hue.onOff = function (deviceName, on) {

   var payload = {
      "on": {
         "on": on
      }
   };
   addStackPaylod(deviceName, payload);
}

hue.coloronly = function (deviceName, hexColor, index) {

   var color = new Color(hexColor);
   [x, y, bright] = color.toCIE();

   // duration not working
   var payload = {
      "color": {
         "xy": {
            "x": x,
            "y": y
         },
         "dynamics": {
            "duration": 0
         }
      }
   };
   addStackPaylod(deviceName, payload);
}

hue.colorbright = function (deviceName, hexColor, index) {

   var color = new Color(hexColor);
   [x, y, bright] = color.toCIE();

   // duration not working
   var payload = {
      "dimming": {
         "brightness": Math.round(bright * 100)
      },
      "color": {
         "xy": {
            "x": x,
            "y": y
         },
         "dynamics": {
            "duration": 0
         }
      }
   };
   addStackPaylod(deviceName, payload);
}

hue.brightness = function (deviceName, value, index) {

   var payload = {
      "dimming": {
         "brightness": value
      },
      "dynamics": {
         "duration": 0
      }
   };
   addStackPaylod(deviceName, payload);

}

/////////////////////////////
// function

function bang() {

}

defaultStack.local = 1;
function defaultStack() {

   return {};
}

addStackPaylod.local = 1;
function addStackPaylod(deviceName, payload) {

   if (!deviceName)
      return;

   var id = deviceMap[deviceName];
   if (!id)
      return;

   if (!stackMap[id])
      stackMap[id] = {};

   for (var key in payload) {
      stackMap[id][key] = payload[key];
   }
}

function sendStack() {

   if (0 == Object.keys(stackMap).length)
      return;

   for (var id in stackMap) {
      var payload = JSON.stringify(stackMap[id]);
      payload = payload.replace('{"on":0}', '{"on":false}');
      payload = payload.replace('{"on":1}', '{"on":true}');

      outlet(0, ["send", id, payload]);
   }

   stackMap = {};
}

function state(on) {

   if (!on)
      return;

   var stateObject = JSON.parse(stateDict.stringify());
   var data = stateObject["data"];
   for (var index in data) {
      var device = data[index];
      var id = device["id"];
      var name = device["metadata"]["name"];
      deviceMap[name] = id;

      var callback = hue.stateChange[name];
      if (!callback)
         continue;

      var deviceState = {};
      deviceState["on"] = device["on"]["on"];
      deviceState["bright"] = device["dimming"]["brightness"];


      callback(deviceState);
   }

}



