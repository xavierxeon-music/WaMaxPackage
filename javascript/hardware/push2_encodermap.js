autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "lookup");

outlets = 1;
setoutletassist(0, "id");

var encodermap = {};

function lookup(name) {

   if (Object.keys(encodermap).length === 0) {
      buildMap();
   }

   var value = 14; // fallback to leftmost encoder   

   if (name in encodermap)
      value = encodermap[name];

   outlet(0, value);
   //post("LOOKUP", name, value, "\n");
}

function buildMap() {

   encodermap["encoder1"] = 14;
   encodermap["encoder2"] = 15;
   encodermap["encoder3"] = 71;
   encodermap["encoder4"] = 72;
   encodermap["encoder5"] = 73;
   encodermap["encoder6"] = 74;
   encodermap["encoder7"] = 75;
   encodermap["encoder8"] = 76;
   encodermap["encoder9"] = 77;
   encodermap["encoder10"] = 78;
   encodermap["encoder11"] = 79;
}
buildMap.local = 1;

