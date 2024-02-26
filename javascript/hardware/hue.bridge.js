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

hue.onOff = function (deviceName, on) {

   var payload = { "on": { "on": on } };
   addStackPaylod(deviceName, payload);


}

hue.color = function (deviceName, hexColor, index) {

   print("color", deviceName, hexColor, index);
}

hue.colorbright = function (deviceName, hexColor, index) {

   print("colorbright", deviceName, hexColor, index);
}

hue.brightness = function (deviceName, value, index) {

   print("brightness", deviceName, value, index);
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

   var text = JSON.stringify(stackMap);
   outlet(0, text);
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



