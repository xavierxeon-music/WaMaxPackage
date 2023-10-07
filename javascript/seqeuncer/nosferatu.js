autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 2;
setoutletassist(0, "pitch / velocity");
setoutletassist(1, "end");

// from file
var loop = 0
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

      outlet(0, [parseInt(pitch), 0]);
   }

   // note on
   for (var pitch in timePoint) {
      var velocity = timePoint[pitch]
      outlet(0, [parseInt(pitch), velocity]);
   }

   lastTimePoiint = timePoint;
   current += 1;

   if (current >= length) {
      outlet(1, "bang");
      if (1 == loop)
         current = 0;
   }
}

function load(fileName) {

   data = readJsonFile(fileName);
   length = data['length'];
   events = data['events'];
   loop = data['loop'];
}

function restart() {
   current = 0;
}

