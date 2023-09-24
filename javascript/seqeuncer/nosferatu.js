autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 3;
setoutletassist(0, "pitch");
setoutletassist(1, "velocity");
setoutletassist(2, "end");


var loop = 0
declareattribute("loop");

var events = []
var length = 0;

var current = 0;
var lastPitch = {};

function bang() {

   if (0 == loop && current >= length)
      return;

   activePitch = {};

   currentEventList = events[current]
   for (var index in currentEventList) {
      note = currentEventList[index];
      pitch = parseInt(note[0]);
      velocity = parseInt(note[1]);

      outlet(0, pitch);
      outlet(1, velocity);

      activePitch[pitch] = true;
      //print("active", pitch);
   }

   for (var pitch in lastPitch) {
      //print("last", pitch, pitch in activePitch);
      if (pitch in activePitch)
         continue;

      outlet(0, parseInt(pitch));
      outlet(1, 0);
   }
   lastPitch = activePitch;

   current += 1;
   if (1 == loop && current >= length)
      current = 0;
}

function load(fileName) {

   data = readJsonFile(fileName);
   length = data['length'];
   events = data['events'];

   restart();
}

function restart() {
   current = 0;
}

