autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "state / tick");

outlets = 1;
setoutletassist(0, "midi");

var lastPulse = -1;
var wasReset = false;

var ticksPerPulse = 20;

function state(value) {

   if (0 == value)
      outlet(0, 252); // stop
   else if (1 == value) {
      if (wasReset) {
         wasReset = false;

         outlet(0, 250); // start
         outlet(0, 248); // clock
      }
      else {
         outlet(0, 251); // continue
      }
   }
}

function tick(value) {

   var reminder = value % ticksPerPulse;
   var pulse = (value - reminder) / ticksPerPulse;

   if (pulse < lastPulse) {
      lastPulse = pulse - 1;
      wasReset = true;
   }
   if (pulse == lastPulse)
      return;

   var diff = pulse - lastPulse;
   for (var index = 0; index < diff; index++)
      outlet(0, 248); // clock

   //print('tick', pulse, lastPulse, diff);
   lastPulse = pulse;
}
