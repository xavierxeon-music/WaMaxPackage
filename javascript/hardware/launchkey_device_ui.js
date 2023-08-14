autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "color midi");

include("_mapped_canvas.js");
include("_launchkey.js");

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
}
paint.local = 1;

// needed to avoid error message
function onclick(x, y) {

   var point = mc.screenToCanvas(x, y);
}
onclick.local = 1;

function onresize(w, h) {

   mc.draw();
}
onresize.local = 1;
