autowatch = 1;
// inlets and outlets
inlets = 1;
setinletassist(0, "messages(note, control)");

outlets = 1;
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
         if (InputType.Blank == type || InputType.Creator == type)
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
   if (name == undefined)
      return;

   outlet(0, [name, value]);
}

function control(controller, value, channel) {

   if (null == launchkey.controlMap)
      return;

   if (1 != channel && 16 != channel)
      return;

   var name = launchkey.controlMap[channel][controller];
   if (name == undefined)
      return;

   outlet(0, [name, value]);
}

