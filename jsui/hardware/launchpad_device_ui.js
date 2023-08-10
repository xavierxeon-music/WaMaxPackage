autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

include("_mapped_canvas.js");


//////////////////////////////////////////

// set up
function Button(x, y) {
   this.x = x;
   this.y = y;

   this.color = "222222";

   return this;
}

var launchpad = new Global("Launchpad");
launchpad.buttonSize = 5;
launchpad.gapSize = 1;
launchpad.deviceLength = (9 * (launchpad.buttonSize + launchpad.gapSize)) + (3 * launchpad.gapSize);
launchpad.device = this;
launchpad.buttonMap = null;

launchpad.getButtonId = function (x, y) {
   return 0;
}

var mc = new MappedCanvas(this, launchpad.deviceLength, launchpad.deviceLength);


//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   launchpad.buttonMap = {};

   for (var xIndex = 0; xIndex < 9; xIndex++) {

      var x = (2 * launchpad.gapSize) + (xIndex * (launchpad.buttonSize + launchpad.gapSize));
      for (var yIndex = 0; yIndex < 9; yIndex++) {

         var y = (2 * launchpad.gapSize) + (yIndex * (launchpad.buttonSize + launchpad.gapSize));
         y = launchpad.deviceLength - (y + launchpad.buttonSize);
         var index = (10 * (yIndex + 1)) + xIndex + 1;

         var button = new Button(x, y);
         launchpad.buttonMap[index] = button;
      }
   }

   mc.draw();

}

function list(id, color) {

   if (launchpad.buttonMap === null)
      return;

   launchpad.buttonMap[id].color = color;
   mc.draw();
}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, launchpad.deviceLength, launchpad.deviceLength, true);

   if (launchpad.buttonMap === null)
      return;


   for (index in launchpad.buttonMap) {

      var button = launchpad.buttonMap[index];
      mc.setColor(button.color);
      mc.drawRectangle(button.x, button.y, launchpad.buttonSize, launchpad.buttonSize, true);

   }

}
paint.local = 1;

function onclick(x, y) {

   var point = mc.screenToCanvas(x, y);
}
onclick.local = 1;


function onresize(w, h) {

   mc.draw();
}
onresize.local = 1;