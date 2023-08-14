autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, value");

outlets = 3;
setoutletassist(0, "value");
setoutletassist(1, "pressed");
setoutletassist(2, "released");

include("_launchkey.js");

//////////////////////////////////////////

// set up
var launchkey = new Global("Launchkey");

var nameId = null;
var toggleEnabled = false;
var canToggle = false;
var buttonDown = false;

//////////////////////////////////////////

function msg_int(value) {

   if (!canToggle || !toggleEnabled) {
      outlet(0, value);
      if (0 != value)
         outlet(1, "bang");
      else
         outlet(2, "bang");
      return;
   }

   // released
   if (0 === value) {
      outlet(2, "bang");
      return;
   }
   else
      outlet(1, "bang");

   if (buttonDown) {
      buttonDown = false;
      outlet(0, 0);
   }
   else {
      buttonDown = true;
      outlet(0, value);
   }
}

function setname(name) {

   nameId = name;
   canToggle = false;
   buttonDown = false

   if (launchkey.placeMap === null)
      return;

   var place = launchkey.placeMap[nameId];
   if (undefined === place)
      return false;

   if (InputType.ColorButton === place.type || InputType.GrayButton === place.type)
      canToggle = true;
}

function toggle(enabled) {

   toggleEnabled = enabled;
   buttonDown = false
}