autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "mesage");

outlets = 1;
setoutletassist(0, "active");

var minColor = new Color("black");
var maxColor = new Color("white");
var targetColor = new Color("red");

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