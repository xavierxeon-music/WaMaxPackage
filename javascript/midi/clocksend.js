autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "state / tick");

outlets = 3;
setoutletassist(0, "midi");
setoutletassist(1, "starttick");
setoutletassist(2, "songpointer");

var lastPulse = -1;
var reset = false;
var ticksPerPulse = 20;

var tempo = 120;
declareattribute("tempo");

function state(value) {

   if (0 == value) {
      outlet(0, 252); // stop
   }
   else if (1 == value) {
      if (reset) {
         reset = false;

         outlet(2, [242, 0, 0]); // song postion pointer

         outlet(0, 250); // start
         outlet(0, 248); // clock
         outlet(1, 248); // extra clock
      }
      else {
         outlet(0, 251); // continue
      }
   }
}

function tick(value) {

   var time = 8 * value / tempo;
   print(tempo);
   outlet(2, time);

   // play starts with tick 1, clock will be sent with start
   if (0 == value) {
      reset = true;
      lastPulse = 1;
      return;
   }

   var reminder = value % ticksPerPulse;
   var pulse = (value - reminder) / ticksPerPulse;

   if (pulse <= lastPulse)
      return;

   var diff = pulse - lastPulse;
   for (var index = 0; index < diff; index++) {
      outlet(0, 248); // clock
   }

   lastPulse = pulse;
}
