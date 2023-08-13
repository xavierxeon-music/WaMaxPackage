autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "color midi");

include("_launchkey.js");

//////////////////////////////////////////

// set up

var launchkey = new Global("Launchkey");


//////////////////////////////////////////

function clearDeviceColor() {

   if (launchkey.placeMap === null)
      return;

   for (nameId in launchkey.placeMap) {

      sendColor(nameId, 0)
   }
}

function sendColor(nameId, colorCode) {

   if (launchkey.placeMap === null)
      return;

   var place = launchkey.placeMap[nameId];
   if (undefined === place)
      return false;

   if (undefined === place.value) {
      print(place.name);
      return false;
   }

   //var first = (place.channel == 1) ? 144 : 159;
   var first = 144;
   if (place.isController) {
      //first = (place.channel == 1) ? 176 : 181;
      first = 176;
   }

   outlet(0, [first, place.value, colorCode]);

   return true;

}