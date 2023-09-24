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
var lastTimePoiint = {};

function bang() {

   if (0 == loop && current >= length)
      return;

   timePoint = events[current]

   // note off
   for (var pitch in lastTimePoiint) {
      if (pitch in timePoint) // only change velocity
         continue;

      outlet(0, parseInt(pitch));
      outlet(1, 0);
   }

   // note on
   for (var pitch in timePoint) {
      var velocity = timePoint[pitch]
      outlet(0, parseInt(pitch));
      outlet(1, velocity);
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

   restart();
}

function restart() {
   current = 0;
}

