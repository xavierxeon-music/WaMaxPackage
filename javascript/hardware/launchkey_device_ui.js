autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "color midi");

include("_mapped_canvas.js");
include("_launchkey.js");


//////////////////////////////////////////

function Place(x, y, placeInfo) {
   this.x = x;
   this.y = y;

   this.color = "444444";
   //this.color = "ff0000";
   this.type = typeFromString(placeInfo["type"]);
   this.name = placeInfo["name"];

   this.value = placeInfo["midi_value"];
   this.isController = placeInfo["midi_cc"];
   this.channel = placeInfo["channel"];

   return this;
}

function MouseHover() {
   this.xIndex = 0;
   this.yIndex = 0;

   this.active = false;
   this.nameId = "none";

   this.stick = false;

   return this;
}

MouseHover.prototype.update = function (x, y) {

   if (this.stick)
      return;

   var point = mc.screenToCanvas(x, y);

   var gridSize = launchkey.gridSize + launchkey.gapSize;

   var xIndex = Math.floor(point[0] / gridSize);
   var yIndex = 2 - Math.floor(point[1] / gridSize);

   if (xIndex == this.xIndex && yIndex == this.yIndex)
      return false;

   this.active = true;
   this.xIndex = xIndex;
   this.yIndex = yIndex;

   if (xIndex < 0 || xIndex > 22 || yIndex < 0 || yIndex > 2)
      this.active = false;

   this.nameId = null;

   var name = null;
   var index = compileKey(yIndex) + compileKey(xIndex);
   if (launchkey.indexMap)
      name = launchkey.indexMap[index];

   if (name && launchkey.placeMap !== null) {
      if (launchkey.placeMap[name] !== undefined) {
         this.nameId = launchkey.placeMap[name].name;
      }
   }

   if (!this.nameId)
      this.active = false;

   return true;
}

//////////////////////////////////////////

// set up

var launchkey = new Global("Launchkey");
launchkey.gridSize = 5;
launchkey.gapSize = 1;
launchkey.device = null;
launchkey.placeMap = null;
launchkey.indexMap = null;

var deviceWidth = (23 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;
var deviceHeight = (3 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;

var mc = new MappedCanvas(this, deviceWidth, deviceHeight);

var mouseHover = new MouseHover();

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   launchkey.device = this;
   launchkey.placeMap = {};
   launchkey.indexMap = {};

   var deviceInfo = readJsonFile(jsarguments[1]);

   for (var xIndex = 0; xIndex < 23; xIndex++) {

      var colKey = compileKey(xIndex);
      var x = launchkey.gapSize + (xIndex * (launchkey.gridSize + launchkey.gapSize));

      for (var yIndex = 0; yIndex < 3; yIndex++) {

         var rowKey = compileKey(yIndex);
         var y = launchkey.gapSize + (yIndex * (launchkey.gridSize + launchkey.gapSize));
         y = deviceHeight - (y + launchkey.gridSize);

         var placeInfo = deviceInfo[rowKey][colKey];
         var place = new Place(x, y, placeInfo);
         launchkey.placeMap[place.name] = place;

         var index = compileKey(yIndex) + compileKey(xIndex);
         launchkey.indexMap[index] = place.name;
      }
   }

   mc.draw();

}

function color(nameId, color) {

   if (null === launchkey.placeMap)
      return;

   if (undefined === launchkey.placeMap[nameId])
      return;

   launchkey.placeMap[nameId].color = color;
   mc.draw();
}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, deviceWidth, deviceHeight, true);

   if (launchkey.placeMap === null)
      return;

   for (nameId in launchkey.placeMap) {

      var place = launchkey.placeMap[nameId];
      if (!place || undefined === place.value)
         continue;

      if (InputType.Button === place.type) {
         mc.setColor(place.color);
         mc.drawRectangle(place.x, place.y, launchkey.gridSize, launchkey.gridSize, true);
      }
      else if (InputType.Pot === place.type) {
         mc.setColor(place.color);
         mc.drawEllipse(place.x, place.y, launchkey.gridSize, launchkey.gridSize, true);
      }
      else if (InputType.Fader === place.type) {
         mc.setColor(place.color);
         mc.drawRectangle(place.x + (1 * launchkey.gapSize), place.y, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
         mc.drawRectangle(place.x + (3 * launchkey.gapSize), place.y, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
      }
   }

   if (mouseHover.active) {

      var x = launchkey.gridSize + (2 * launchkey.gapSize);
      var y = launchkey.gapSize;

      var width = (8 * launchkey.gridSize) + (7 * launchkey.gapSize);
      var height = 2 * (launchkey.gridSize + launchkey.gapSize);

      if (mouseHover.xIndex < 12)
         x = (14 * launchkey.gridSize) + (15 * launchkey.gapSize);

      if (mouseHover.stick)
         mc.setColor("222266");
      else
         mc.setColor("111111");
      mc.drawRectangle(x, y, width, height, true);

      mc.setColor("ffffff");
      mc.drawText(x + 2, y + 8, mouseHover.nameId);
   }

}
paint.local = 1;

// needed to avoid error message
function onclick() {

   mouseHover.stick = !mouseHover.stick;
   mc.draw();
}
onclick.local = 1;

function onidle(x, y) {

   if (mouseHover.update(x, y))
      mc.draw();
}
onclick.onidle = 1;

function onidleout(x, y) {

   if (!mouseHover.stick) {
      mouseHover.active = false;
      mc.draw();
   }
}
onclick.onidleout = 1;

function onresize(w, h) {

   mc.draw();
}
onresize.local = 1;
