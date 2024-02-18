autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "value");

outlets = 1;
setoutletassist(0, "value");

//////////////////////////////////////////

// set up

var on = false;
declareattribute("on");

//////////////////////////////////////////

function setValue(value) {

   // released
   if (0 === value)
      return;


   if (on) {
      on = false;
      outlet(0, 0);
   }
   else {
      on = true;
      outlet(0, value);
   }
}


