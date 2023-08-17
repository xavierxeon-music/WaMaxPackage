autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "midi");

include("_mapped_canvas.js");


//////////////////////////////////////////

function Button(x, y) {
   this.x = x;
   this.y = y;

   this.color = "444444";

   return this;
}

function MouseHover() {
   this.xIndex = 0;
   this.yIndex = 0;

   this.active = false;
   this.id = 0;

   return this;
}

MouseHover.prototype.update = function (x, y) {

   var point = mc.screenToCanvas(x, y);

   var gridSize = launchpad.buttonSize + launchpad.gapSize;

   var xIndex = Math.floor(point[0] / gridSize);
   var yIndex = 8 - Math.floor(point[1] / gridSize);

   if (xIndex == this.xIndex && yIndex == this.yIndex)
      return false;

   this.active = true;
   this.xIndex = xIndex;
   this.yIndex = yIndex;

   if (xIndex < 0 || xIndex > 8 || yIndex < 0 || yIndex > 8)
      this.active = false;

   this.id = (10 * (yIndex + 1)) + (xIndex + 1);

   return true;
}

//////////////////////////////////////////

// set up
var launchpad = new Global("Launchpad");
launchpad.buttonSize = 5;
launchpad.gapSize = 1;
launchpad.device = null;
launchpad.buttonMap = null;
launchpad.nameMap = {};

var deviceSize = (9 * (launchpad.buttonSize + launchpad.gapSize)) + launchpad.gapSize;
var mc = new MappedCanvas(this, deviceSize, deviceSize);

var mouseHover = new MouseHover();
var mousePressed = false;
var createState = false;

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   launchpad.device = this;
   launchpad.buttonMap = {};

   for (var xIndex = 0; xIndex < 9; xIndex++) {

      var x = launchpad.gapSize + (xIndex * (launchpad.buttonSize + launchpad.gapSize));
      for (var yIndex = 0; yIndex < 9; yIndex++) {

         var y = launchpad.gapSize + (yIndex * (launchpad.buttonSize + launchpad.gapSize));
         y = deviceSize - (y + launchpad.buttonSize);
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

   if (launchpad.buttonMap[id] === undefined)
      return;

   launchpad.buttonMap[id].color = color;
   mc.draw();
}

function setState(newState) {

   createState = newState;
}

paint.local = 1;
function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, deviceSize, deviceSize, true);

   if (launchpad.buttonMap === null)
      return;


   for (index in launchpad.buttonMap) {

      var button = launchpad.buttonMap[index];
      mc.setColor(button.color);
      mc.drawRectangle(button.x, button.y, launchpad.buttonSize, launchpad.buttonSize, true);
   }

   if (mouseHover.active) {

      var x = (1 * launchpad.buttonSize) + (2 * launchpad.gapSize);
      var y = (1 * launchpad.buttonSize) + (2 * launchpad.gapSize);
      var sizeX = (7 * launchpad.buttonSize) + (6 * launchpad.gapSize);
      var sizeY = (2 * launchpad.buttonSize) + launchpad.gapSize;
      if (mouseHover.yIndex >= 4)
         y = (6 * launchpad.buttonSize) + (7 * launchpad.gapSize);

      mc.setColor("111111");
      mc.drawRectangle(x, y, sizeX, sizeY, true);

      var id = mouseHover.id;
      var text = launchpad.nameMap[id];
      if (undefined == text)
         text = id.toString();
      else if (text.length > 9)
         text = text.substring(0, 9);

      mc.setColor("ffffff");
      mc.drawText(x + 2, y + 8, text);
   }

}

onclick.local = 1;
function onclick() {

   mousePressed = true;
   if (!createState && mouseHover.active)
      outlet(0, [mouseHover.id, 127]);
}

ondblclick.local = 1;
function ondblclick(x, y) {

   if (!createState)
      return;

   var topPatcher = this.patcher;
   while (topPatcher.parentpatcher)
      topPatcher = topPatcher.parentpatcher;

   var my_rect = getPresentationRectanlge(this);

   var x = my_rect[0];
   var y = my_rect[1] + my_rect[3];
   topPatcher.newdefault(x, y, "wa.launchpad.element", mouseHover.id);
}

onidle.local = 1;
function onidle(x, y, button) {

   if (mousePressed) {
      mousePressed = false;
      if (!createState && mouseHover.active)
         outlet(0, [mouseHover.id, 0]);
   }
   else if (mouseHover.update(x, y))
      mc.draw();
}

onidleout.local = 1;
function onidleout(x, y) {

   mouseHover.active = false;
   mc.draw();
}


onresize.local = 1;
function onresize(w, h) {

   mc.draw();
}