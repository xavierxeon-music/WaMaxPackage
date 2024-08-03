//  inlets and outlets
inlets = 1;
setinletassist(0, "message(setMin, setMax, increment, decrement, forceValue)");

outlets = 1;
setoutletassist(0, "value");

//////////////////////////////////////////

var min = 0;
var max = 100;
var current = 0;
var wrapAround = false;

function getvalueof() {
   return current
}

function setvalueof(value) {
   current = value
   outlet(0, current);
}

//////////////////////////////////////////


function setMin(value) {

   if (value > max)
      return;
   else
      min = value;

   if (current < min) {
      current = min;
      outlet(0, current);
   }

   //print("setMin", value, min, max, current);
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

   //print("setMax", value, min, max, current);
}

function diff(value) {

   current += value;

   //print("diff", current, value, min, max);

   if (wrapAround) {
      var range = max - min;
      while (current >= max)
         current -= range;
      while (current < min)
         current += range;
   }
   else {
      if (current > max)
         current = max;
      else if (current < min)
         current = min;
   }

   outlet(0, current);
}



function forceValue(value) {

   if (value < min)
      current = min;
   else if (value > max)
      current = max;
   else
      current = value;

   outlet(0, current);

   //print("forceValue", min, max, current);
}

function wrap(value) {

   wrapAround = value;
}


