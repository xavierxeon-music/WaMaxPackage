autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

include("_canvas.js");


//////////////////////////////////////////

// set up
var cubeSide = 5;
var cubeGap = 1;
var deviceLength = (9 * (cubeSide + cubeGap)) + (3 * cubeGap);

canvas = new Canvas(this, deviceLength, deviceLength);

//////////////////////////////////////////

function loadbang() {

   canvas.draw();
}

function bang() {

   canvas.draw();
}


function paint() {

   print("paint");

   canvas.setColor("111111");
   canvas.drawRectangle(0, 0, deviceLength, deviceLength, true);

   canvas.setColor("bbbbbb");

   for (var xIndex = 0; xIndex < 9; xIndex++) {

      var x = (2 * cubeGap) + (xIndex * (cubeSide + cubeGap));
      for (var yIndex = 0; yIndex < 9; yIndex++) {

         var y = (2 * cubeGap) + (yIndex * (cubeSide + cubeGap));
         canvas.drawRectangle(x, y, cubeSide, cubeSide, true);

      }

   }
}
paint.local = 1;

function onclick(x, y) {

   var point = canvas.screenToCanvas(x, y);
}
onclick.local = 1;


function onresize(w, h) {

   canvas.draw();
}
onresize.local = 1;