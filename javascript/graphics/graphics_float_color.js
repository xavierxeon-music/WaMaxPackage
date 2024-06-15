autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "hex color");

outlets = 1;
setoutletassist(0, "list color");

function color(value) {

   var color = Color(value);
   var red = color.red / 255.0;
   var green = color.green / 255.0;
   var blue = color.blue / 255.0;

   outlet(0, [red, green, blue, 1.0]);
}

