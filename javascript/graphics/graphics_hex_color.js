autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list color");

outlets = 1;
setoutletassist(0, "hex color");

function list(red, green, blue) {
   var hex = makeHex(red * 255);
   hex += makeHex(green * 255);
   hex += makeHex(blue * 255);

   outlet(0, hex);
}

