autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "color");

outlets = 3;
setoutletassist(0, "red");
setoutletassist(1, "green");
setoutletassist(2, "blue");

function parseColor(name) {

   color = new Color(name);
   outlet(0, color.red / 2);
   outlet(1, color.green / 2);
   outlet(2, color.blue / 2);
}