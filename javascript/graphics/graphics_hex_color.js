autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list color");

outlets = 1;
setoutletassist(0, "hex color");

makeHex.local = 1;
function makeHex(number) {
   var hex = Math.round(number).toString(16);
   if (1 === hex.length)
      hex = "0" + hex;

   return hex;
}

function list(red, green, blue) {
   var hex = makeHex(red * 255);
   hex += makeHex(green * 255);
   hex += makeHex(blue * 255);

   outlet(0, hex);
}

