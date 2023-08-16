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

   this.object = placeInfo["object"];
   if (this.object)
      this.object = this.object.replace("%LAUNCHKEY%", "\"Internal LaunchKey\"");

   return this;
}

function MouseHover() {
   this.xIndex = 0;
   this.yIndex = 0;

   this.active = false;
   this.stick = false;

   this.nameId = "none";
   this.type = InputType.Blank;

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
   this.type = InputType.Blank;

   var name = null;
   var index = compileKey(yIndex) + compileKey(xIndex);
   if (launchkey.indexMap)
      name = launchkey.indexMap[index];

   if (name && launchkey.placeMap != null) {
      if (launchkey.placeMap[name] != undefined) {
         this.nameId = launchkey.placeMap[name].name;
         this.type = launchkey.placeMap[name].type;
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

   if (null == launchkey.placeMap)
      return;

   if (undefined == launchkey.placeMap[nameId])
      return;

   launchkey.placeMap[nameId].color = color;
   mc.draw();
}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, deviceWidth, deviceHeight, true);

   if (null == launchkey.placeMap)
      return;

   for (nameId in launchkey.placeMap) {

      var place = launchkey.placeMap[nameId];
      if (!place)
         continue;

      switch (place.type) {
         case InputType.ColorButton:
         case InputType.GrayButton:
            mc.setColor(place.color);
            mc.drawRectangle(place.x, place.y, launchkey.gridSize, launchkey.gridSize, true);
            break;
         case InputType.Pot:
            mc.setColor(place.color);
            mc.drawEllipse(place.x, place.y, launchkey.gridSize, launchkey.gridSize, true);
            break;
         case InputType.Fader:
            mc.setColor(place.color);
            mc.drawRectangle(place.x + (1 * launchkey.gapSize), place.y, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
            mc.drawRectangle(place.x + (3 * launchkey.gapSize), place.y, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
            break;
         case InputType.Creator:
            mc.setColor("8888dd");
            mc.drawRectangle(place.x + (2 * launchkey.gapSize), place.y, launchkey.gapSize, launchkey.gridSize, true);
            mc.drawRectangle(place.x, place.y + (2 * launchkey.gapSize), launchkey.gridSize, launchkey.gapSize, true);
            break;
      }
   }

   if (mouseHover.active) {

      var x = launchkey.gridSize + (2 * launchkey.gapSize);
      var y = launchkey.gapSize;

      var width = (10 * launchkey.gridSize) + (9 * launchkey.gapSize);
      var height = 2 * (launchkey.gridSize + launchkey.gapSize);

      if (mouseHover.xIndex < 12)
         x = (12 * launchkey.gridSize) + (13 * launchkey.gapSize);

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

function onclick() {

   mouseHover.stick = !mouseHover.stick;
   mc.draw();
}
onclick.local = 1;

function ondblclick(x, y) {

   if (!mouseHover.active)
      return;

   var topPatcher = this.patcher;
   while (topPatcher.parentpatcher)
      topPatcher = topPatcher.parentpatcher;

   var my_rect = getPresentationRectanlge(this);

   var x = my_rect[0];
   var y = my_rect[1] + my_rect[3];
   if (InputType.Creator === mouseHover.type) {
      var place = launchkey.placeMap[mouseHover.nameId];
      topPatcher.newdefault(x, y, place.object);
   }
   else if (InputType.Blank !== mouseHover.type) {
      topPatcher.newdefault(x, y, "wa.launchkey.element", mouseHover.nameId);
   }
}
onclick.ondblclick = 1;

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
