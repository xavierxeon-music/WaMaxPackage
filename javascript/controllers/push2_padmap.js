autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "lookup");

outlets = 1;
setoutletassist(0, "id");

var padmap = {};

function lookup(name) {

   if (Object.keys(padmap).length === 0) {
      buildMap();
   }

   var value = 36; // fallback to pad on bottom left   

   if (name in padmap)
      value = padmap[name];

   outlet(0, value);
   //post("LOOKUP", name, value, "\n");
}

function fromPush(id, velocity) {

   if (Object.keys(padmap).length === 0) {
      buildMap();
   }

   for (var key in padmap) {
      const value = padmap[key];
      if (id === value) {
         outlet(0, "PAD " + key);
         return;
      }
   }

   outlet(0, "??? " + id);
}


function buildMap() {

   var value = 36;
   for (var col = 1; col < 9; col++) {
      for (var row = 1; row < 9; row++) {
         var name = "p" + (row + 10 * col);
         padmap[name] = value;
         //post("BUILD", name, value, "\n");
         value += 1;
      }
   }

   padmap["slider"] = 12;
   padmap["encoder1"] = 10;
   padmap["encoder2"] = 9;
   padmap["encoder3"] = 0;
   padmap["encoder4"] = 1;
   padmap["encoder5"] = 2;
   padmap["encoder6"] = 3;
   padmap["encoder7"] = 4;
   padmap["encoder8"] = 5;
   padmap["encoder9"] = 6;
   padmap["encoder10"] = 7;
   padmap["encoder11"] = 8;
}
buildMap.local = 1;

