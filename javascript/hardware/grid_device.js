autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "midi");

var lookup = new Dict("grid_mapping");

var redMidi = 128;
var greenMidi = 144;
var blueMidi = 160;

function parseColor(localId, name) {

   color = new Color(name);
   red = Math.floor(color.red / 2)
   green = Math.floor(color.green / 2)
   blue = Math.floor(color.blue / 2)

   id = lookup.get("local_to_midi::" + localId);

   // print(id, name, red, green, blue);

   outlet(0, [redMidi, id, red]);
   outlet(0, [greenMidi, id, green]);
   outlet(0, [blueMidi, id, blue]);
}