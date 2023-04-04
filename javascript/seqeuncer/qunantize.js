autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "midinote");

outlets = 1;
setoutletassist(0, "midinote");

var scales = new Global("Scales");
var scaleName = "main";

function name(text) {

   scaleName = text;
}

function msg_int(midiNote) {

   if (scales.target === undefined) {
      post("no target", "\n");
      return out(midiNote);
   }

   if (scales.target[scaleName] === undefined) {
      post("no scale", scaleName, "\n");
      return out(midiNote);
   }


   midiNote = scales.target[scaleName].closestMatch(midiNote);
   out(midiNote);
}

function out(midiNote) {

   outlet(0, midiNote);
}
out.local = 1;

