autowatch = 1;
// inlets and outlets
inlets = 1;
setinletassist(0, "messages(note, control)");

outlets = 2;
setoutletassist(0, "color midi");
setoutletassist(1, "[name, value]");

include("_launchkey.js");

//////////////////////////////////////////

var launchkey = new Global("Launchkey");
launchkey.noteMap = null;
launchkey.controlMap = null;

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   var deviceInfo = readJsonFile(jsarguments[1]);

   launchkey.noteMap = { 1: {}, 16: {} };
   launchkey.controlMap = { 1: {}, 16: {} };

   for (var rowKey in deviceInfo) {
      for (var colKey in deviceInfo[rowKey]) {
         var placeInfo = deviceInfo[rowKey][colKey];

         var type = typeFromString(placeInfo["type"]);
         if (InputType.Blank == type)
            continue;

         var name = placeInfo["name"];

         var value = placeInfo["midi_value"];
         var isController = placeInfo["midi_cc"];
         var channel = placeInfo["channel"];

         if (isController)
            launchkey.controlMap[channel][value] = name;
         else
            launchkey.noteMap[channel][value] = name;
      }
   }
}

function note(note, value, channel) {

   if (null === launchkey.noteMap)
      return;

   if (1 != channel && 16 != channel)
      return;

   var name = launchkey.noteMap[channel][note];
   if (name === undefined)
      return;

   outlet(1, [name, value]);
}

function control(controller, value, channel) {

   if (null == launchkey.controlMap)
      return;

   if (1 != channel && 16 != channel)
      return;

   var name = launchkey.controlMap[channel][controller];
   if (name === undefined)
      return;

   outlet(1, [name, value]);
}


function color(name, color) {

   if (null === launchkey.placeMap)
      return;

   var place = launchkey.placeMap[name];
   if (undefined === place)
      return;

   //var first = (place.channel == 1) ? 144 : 159;
   var first = 144;
   if (place.isController) {
      //first = (place.channel == 1) ? 176 : 181;
      first = 176;
   }

   outlet(0, [first, place.value, color]);
}
