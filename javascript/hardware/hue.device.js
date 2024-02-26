autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "state");

/////////////////////////////
// vars / setup

var hue = new Global("hue");

var deviceName = undefined;

/////////////////////////////
// function

stateChange.local = 1;
function stateChange(state) {

   var on = state["on"];
   outlet(0, on);
}

function init(_deviceName) {

   deviceName = _deviceName;

   if (!hue.stateChange)
      hue.stateChange = {};

   hue.stateChange[deviceName] = stateChange;

}

function on() {

   if (!hue.onOff)
      return;

   hue.onOff(deviceName, true);
}

function off() {

   if (!hue.onOff)
      return;

   hue.onOff(deviceName, false);
}

function color(hexColor, index) {

   if (!index)
      index = 0;

   if (!hue.onOff)
      return;

   hue.coloronly(deviceName, hexColor, index);
}

function colorbright(hexColor, index) {

   if (!index)
      index = 0;

   if (!hue.onOff)
      return;

   hue.colorbright(deviceName, hexColor, index);
}

function brightness(value, index) {

   if (!index)
      index = 0;

   if (!hue.onOff)
      return;

   hue.brightness(deviceName, value, index);
}
