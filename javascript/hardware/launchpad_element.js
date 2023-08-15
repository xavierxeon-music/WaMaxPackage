autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, value");

outlets = 3;
setoutletassist(0, "value");
setoutletassist(1, "pressed");
setoutletassist(2, "released");

//////////////////////////////////////////

// set up

var toggleEnabled = false;
var buttonDown = false;
declareattribute("buttonDown", "getButtonDown", "setButtonDown");

//////////////////////////////////////////

function msg_int(value) {

   if (!toggleEnabled) {
      outlet(0, (0 == value) ? 0 : 1);
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
      outlet(0, 1);
   }
}

function toggle(enabled) {

   toggleEnabled = enabled;
   buttonDown = false
}


function getButtonDown() {

   return buttonDown;
}

function setButtonDown(isDown) {

   buttonDown = isDown;

   if (!toggleEnabled)
      return;

   outlet(0, buttonDown);
}

