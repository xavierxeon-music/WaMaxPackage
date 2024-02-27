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
var gradientList = [];
var reverseGradient = false;

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

function deinit() {

   delete hue.stateChange[deviceName];
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

function color(hexColor) {

   if (!hue.onOff)
      return;

   hue.coloronly(deviceName, hexColor);
}

function colorbright(hexColor) {

   if (!hue.onOff)
      return;


   hue.colorbright(deviceName, hexColor);
}

function brightness(value) {

   if (!hue.onOff)
      return;

   hue.brightness(deviceName, value);
}

function gradientcount(value) {

   if (value < 0) {
      reverseGradient = true;
      value *= -1;
   }
   else
      reverseGradient = false;

   gradientList = [];
   for (var index = 0; index < value; index++)
      gradientList.push("000000");
}

function gradient(index, hexColor) {

   if (index >= gradientList.length)
      return;

   if (!hue.gradient)
      return;

   // print(index, hexColor, reverseGradient);

   if (reverseGradient)
      index = gradientList.length - (1 + index);

   gradientList[index] = hexColor;
   hue.gradient(deviceName, gradientList);

}