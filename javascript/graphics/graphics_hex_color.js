autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list color");

outlets = 1;
setoutletassist(0, "hex color");

function list(red, green, blue) {

   var color = Color.fromRGB(red * 255, green * 255, blue * 255);
   outlet(0, color.hex);
}

