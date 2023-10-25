autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 2;
setoutletassist(0, "pitch / velocity");
setoutletassist(1, "end");

// from file
function Sequence(data) {

   this.loop = 0;
   this.length = 0;
   this.events = [];

   if (data) {
      this.length = data['length'];
      this.events = data['events'];
      this.loop = data['loop'];
   }

   return this;
}

var sequences = {};

var timePoint = "1.1"
var current = 0;
var lastEvent = {};

function bang() {

   var sequence = sequences[timePoint];
   if (!sequence)
      return;

   if (!sequence.loop && current >= sequence.length)
      return;

   currentEvent = sequence.events[current]

   // note off
   for (var pitch in lastEvent) {
      if (pitch in currentEvent) // only change velocity
         continue;

      outlet(0, [parseInt(pitch), 0]);
   }

   // note on
   for (var pitch in currentEvent) {
      var velocity = currentEvent[pitch]
      outlet(0, [parseInt(pitch), velocity]);
   }

   lastEvent = currentEvent;
   current += 1;

   if (current >= sequence.length) {
      outlet(1, "bang");
      if (sequence.loop)
         current = 0;
   }
}

function time(bar, beat) {

   var tp = bar.toString() + "." + beat.toString();
   if (tp in sequences) {
      timePoint = tp;
   }
}

function load(fileName) {

   sequences = {};

   var content = readJsonFile(fileName);
   for (var timePoint in content) {
      var data = content[timePoint];
      sequences[timePoint] = new Sequence(data)
   }
}

function restart() {

   timePoint = "1.1"
   current = 0;
}

