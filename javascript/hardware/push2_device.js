autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "lookup");

outlets = 3;
setoutletassist(0, "id");
setoutletassist(1, "isColor");
setoutletassist(1, "key");

var buttonmap = {};

function lookup(name) {

   if (Object.keys(buttonmap).length === 0) {
      buildMap();
   }

   var value = 85; // fallback to play button on bottom left   

   var isColor = true;
   if (name in buttonmap) {
      value = buttonmap[name][0];
      isColor = (1 == buttonmap[name][1]);
   }

   outlet(0, value);
   outlet(1, isColor);
}

function fromPush(id) {

   if (Object.keys(buttonmap).length === 0) {
      buildMap();
   }
   for (var name in buttonmap) {
      const value = buttonmap[name][0];
      const isColor = (1 == buttonmap[name][1]);
      if (value === id) {
         if (isColor)
            outlet(0, "RGB BUTTON " + name);
         else
            outlet(0, "BUTTON " + name);
         outlet(2, name);
         return;
      }
   }

   outlet(0, "???" + id);
}

buildMap.local = 1;
function buildMap() {

   buttonmap = readJsonFile(jsarguments[1]);
}

