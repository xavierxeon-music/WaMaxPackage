autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, value");

outlets = 1;
setoutletassist(0, "value");

include("_launchkey.js");

//////////////////////////////////////////

// set up
var launchkey = new Global("Launchkey");

var isToggle = false;
var canToggle = false;

//////////////////////////////////////////

function setName(nameId) {

   canToggle = compileCanToggle(nameId);
   print("canToggle", canToggle, nameId)
   update();
}

function setToggle(enabled) {

   isToggle = enabled;
   print("isToggle", isToggle);
   update();
}


function compileCanToggle(nameId) {

   if (launchkey.placeMap === null)
      return false;

   var place = launchkey.placeMap[nameId];
   if (undefined === place)
      return false;

   if (InputType.ColorButton !== place.type && InputType.GrayButton !== place.type)
      return false;

   return true;
}
compileCanToggle.local = 1;

function update() {

   if (canToggle && isToggle)
      outlet(0, 2);
   else
      outlet(0, 1);
}
update.local = 1;