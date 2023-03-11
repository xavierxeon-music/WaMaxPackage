autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "id");

outlets = 1;
setoutletassist(0, "id");

var padmap = {};

function msg_int(id) {

   if (Object.keys(padmap).length === 0) {
      buildMap();
   }

   var value = 36; // fallback to pad on bottom left   

   if (id in padmap)
      value = padmap[id];

   outlet(0, value);
   //post("LOOKUP", id, value, "\n");
}


function buildMap() {

   var value = 36;
   for (var col = 1; col < 9; col++) {
      for (var row = 1; row < 9; row++) {
         var id = row + 10 * col;
         padmap[id] = value;
         //post("BUILD", id, value, "\n");
         value += 1;
      }
   }
}
buildMap.local = 1;

