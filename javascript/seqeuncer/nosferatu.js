autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 2;
setoutletassist(0, "pitch");
setoutletassist(1, "velocity");

var loop = 0
declareattribute("loop");

var events = []
var length = 0;

var current = 0;
var lastTimePoiint = {};

function bang() {

   if (0 == loop && current >= length)
      return;

   timePoint = events[current]

   // note off
   for (var pitch in lastTimePoiint) {
      if (pitch in timePoint) // only change velocity
         continue;

      outlet(1, 0);
      outlet(0, parseInt(pitch));
   }

   // note on
   for (var pitch in timePoint) {
      var velocity = timePoint[pitch]
      outlet(1, velocity);
      outlet(0, parseInt(pitch));
   }

   lastTimePoiint = timePoint;

   current += 1;
   if (1 == loop && current >= length)
      current = 0;
}

function load(fileName) {

   data = readJsonFile(fileName);
   length = data['length'];
   events = data['events'];
}

function restart() {
   current = 0;
}

