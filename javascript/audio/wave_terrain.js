autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "mesage");

outlets = 1;
setoutletassist(0, "active");

// active
var minColor = new Color("black");
var maxColor = new Color("white");
var targetColor = new Color("red");

// box
var width = 1;
var height = 1;
var x = 0;
var y = 0;
var rx = 1;
var ry = 1;

function min(a, r, g, b) {

   minColor = Color.fromRGB(r, g, b);
   testAllColorsOff();
}


function max(a, r, g, b) {

   maxColor = Color.fromRGB(r, g, b);
   testAllColorsOff();
}

function offColor(hexColor) {

   targetColor = new Color(hexColor);
   testAllColorsOff();
}

function bBox(name, value) {

   if ("width" == name)
      width = Math.round(value);
   else if ("height" == name)
      height = Math.round(value);
   else if ("x" == name)
      x = Math.round(value);
   else if ("y" == name)
      y = Math.round(value);
   else if ("rx" == name)
      rx = Math.round(value);
   else if ("ry" == name)
      ry = Math.round(value);

   var cx = clamp(x, rx, width - rx);
   var cy = clamp(y, ry, height - ry);

   var minx = cx - rx;
   var miny = cy - ry;
   outlet(0, ["offset", minx, miny]);
   outlet(0, ["dim", 2 * rx, 2 * ry]);
}



clamp.local = 1;
function clamp(num, a, b) {

   if (num < a)
      num = a;
   else if (num > b)
      num = b;

   return num;
}

testAllColorsOff.local = 1;
function testAllColorsOff() {

   // not uniform
   if (minColor.distance(maxColor) > 0) {
      outlet(0, 1);
      return;
   }

   // not target
   if (minColor.distance(targetColor) > 0) {
      outlet(0, 1);
      return;
   }

   outle(0, 0);
}