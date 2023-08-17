autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "midi");

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

launchkey.valueFeedback = function (nameId, value) {

   this.device.valueFeedback(nameId, value);
};

var deviceWidth = (23 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;
var deviceHeight = (3 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;

var mc = new MappedCanvas(this, deviceWidth, deviceHeight);

var mouseHover = new MouseHover();
var mousePressed = false;
var createState = false;
var freezeControl = false;
valueMap = {};

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   launchkey.device = this;
   launchkey.placeMap = {};
   launchkey.indexMap = {};

   mousePressed = false;
   createState = false;
   freezeControl = false;

   valueMap = {};

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

   setValueVisibility(false);
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

function setState(newState) {

   createState = newState;
}

function set(value) {

   outlet(0, [mouseHover.nameId, value]);
}

paint.local = 1;
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

      if (freezeControl)
         mc.setColor("222266");
      else
         mc.setColor("111111");
      mc.drawRectangle(x, y, width, height, true);

      mc.setColor("ffffff");
      mc.drawText(x + 2, y + 8, mouseHover.nameId);
   }

}

setValueVisibility.local = 1;
function setValueVisibility(show, elementId) {

   var hidden = show ? "0" : "1";

   var slider = this.patcher.getnamed("value_slider");
   slider.message("sendbox", "hidden", hidden);

   var display = this.patcher.getnamed("value_display");
   display.message("sendbox", "hidden", hidden);

   var value = valueMap[elementId];
   if (undefined == value)
      value = 0;

   showValue(value);
}

valueFeedback.local = 1;
function valueFeedback(elementId, value) {

   valueMap[elementId] = value;
   showValue(value);
}

updateValue.local = 1;
function showValue(value) {

   var slider = this.patcher.getnamed("value_slider");
   slider.message("set", value);

   var display = this.patcher.getnamed("value_display");
   display.message("set", value);
}

onclick.local = 1;
function onclick() {

   if (freezeControl) {
      freezeControl = false;
      setValueVisibility(freezeControl);
      mc.draw();
      return;
   }

   if (!createState && mouseHover.active) {

      if (InputType.ColorButton == mouseHover.type || InputType.GrayButton == mouseHover.type) {
         mousePressed = true;
         outlet(0, [mouseHover.nameId, 127]);
      }
      else if (InputType.Pot == mouseHover.type || InputType.Fader == mouseHover.type) {
         freezeControl = true;
         setValueVisibility(freezeControl, mouseHover.nameId);
         mc.draw();
      }
   }
}

ondblclick.local = 1;
function ondblclick(x, y) {

   if (!createState)
      return;

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
   else if (InputType.ColorButton === mouseHover.type || InputType.GrayButton === mouseHover.type) {
      topPatcher.newdefault(x, y, "wa.launchkey.element", mouseHover.nameId);
   }
   else if (InputType.Pot === mouseHover.type || InputType.Fader === mouseHover.type) {
      topPatcher.newdefault(x, y, "wa.launchkey.element", mouseHover.nameId, "@downColor", "white");
   }
}

onidle.local = 1;
function onidle(x, y) {

   if (mousePressed) {
      mousePressed = false;
      if (!createState && mouseHover.active) {
         if (InputType.ColorButton == mouseHover.type || InputType.GrayButton == mouseHover.type) {
            outlet(0, [mouseHover.nameId, 0]);
         }
      }
   }
   else if (!freezeControl && mouseHover.update(x, y))
      mc.draw();
}

onidleout.local = 1;
function onidleout(x, y) {

   if (freezeControl)
      return;

   mouseHover.active = false;
   mc.draw();
}

onresize.local = 1;
function onresize(w, h) {

   mc.draw();
}
