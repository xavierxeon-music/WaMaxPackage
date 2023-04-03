autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "pitch");

var pitches = [];

function pitchOffset(values) {

   pitches = values.split(" ");
}

function stageIndex(index) {

   var pitch = pitches[index];
   outlet(0, pitch);
}
