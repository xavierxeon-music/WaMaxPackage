//  inlets and outlets
inlets = 1;
setinletassist(0, "message(setMin, setMax, increment, decrement, setValue)");

outlets = 1;
setoutletassist(0, "value");

var min = 0;
var max = 100;
var current = 0;
var wrapAround = false;

function setMin(value) {

   if (value > max)
      return;
   else
      min = value;

   if (current < min) {
      current = min;
      outlet(0, current);
   }

   //post("setMin", value, min, max, current);
}

function setMax(value) {

   if (value < min)
      return;
   else
      max = value;

   if (current > max) {
      current = max;
      outlet(0, current);
   }

   //post("setMax", value, min, max, current);
}

function increment() {

   if (current < max)
      current += 1;
   else if (wrapAround)
      current = min;

   outlet(0, current);

   //post("increment", min, max, current);
}

function decrement() {

   if (current > min)
      current -= 1;
   else if (wrapAround)
      current = max;

   outlet(0, current);

   //post("decrement", min, max, current);
}


function forceValue(value) {

   if (value < min)
      current = min;
   else if (value > max)
      current = max;
   else
      current = value;

   outlet(0, current);

   //post("forceValue", min, max, current);
}

function wrap(value) {

   wrapAround = value;
}


