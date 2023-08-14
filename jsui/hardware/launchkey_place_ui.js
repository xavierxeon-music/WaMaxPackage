autowatch = 1;

// inlets and outlets
outlets = 1;
setoutletassist(0, "id");

include("_mapped_canvas.js");
include("_launchkey.js");

//////////////////////////////////////////

// set up
var launchkey = new Global("Launchkey");
launchkey.gridSize = 5;
launchkey.gapSize = 1;

var buttonSize = launchkey.gridSize + (2 * launchkey.gapSize);
var mc = new MappedCanvas(this, buttonSize, buttonSize);

var nameId = null;

//////////////////////////////////////////

var tsk = new Task(updateButtonId, this);
tsk.interval = 1000; // every second
tsk.repeat();

//////////////////////////////////////////

function loadbang() {

   // bang();
}

function bang() {

   updateButtonId();

   if (null == nameId)
      outlet(0, ["setButton", 0]);
   else
      outlet(0, ["setButton", nameId]);

   mc.draw();
}

function color(changedId, color) {

   if (changedId === nameId)
      mc.draw();
}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, buttonSize, buttonSize, true);

   if (null !== nameId && launchkey.placeMap) {

      var place = launchkey.placeMap[nameId];
      if (!place)
         return;

      if (InputType.Button === place.type) {
         mc.setColor(place.color);
         mc.drawRectangle(launchkey.gapSize, launchkey.gapSize, launchkey.gridSize, launchkey.gridSize, true);
      }
      else if (InputType.Pot === place.type) {
         mc.setColor(place.color);
         mc.drawEllipse(launchkey.gapSize, launchkey.gapSize, launchkey.gridSize, launchkey.gridSize, true);
      }
      else if (InputType.Fader === place.type) {
         mc.setColor(place.color);
         mc.drawRectangle(launchkey.gapSize + (1 * launchkey.gapSize), launchkey.gapSize, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
         mc.drawRectangle(launchkey.gapSize + (3 * launchkey.gapSize), launchkey.gapSize, launchkey.gridSize - (4 * launchkey.gapSize), launchkey.gridSize, true);
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

function updateButtonId() {

   var topPatcher = this.patcher;
   while (topPatcher.parentpatcher) {
      topPatcher = topPatcher.parentpatcher;
   }

   var my_rect = getPresentationRectanlge(this);
   if (null == my_rect)
      return;

   var parent_rect = getPresentationRectanlge(launchkey.device);
   if (null == parent_rect)
      return;

   //print(this, my_rect, parent_rect);

   var gridSize = my_rect[2];

   var diffX = my_rect[0] - parent_rect[0];
   var diffY = my_rect[1] - parent_rect[1];

   var xIndex = Math.floor(diffX / gridSize);
   var yIndex = 2 - Math.floor(diffY / gridSize);

   var newId = null;

   var name = null;
   var index = compileKey(yIndex) + compileKey(xIndex);
   if (launchkey.indexMap)
      name = launchkey.indexMap[index];

   if (name && launchkey.placeMap !== null) {
      if (launchkey.placeMap[name] !== undefined) {
         newId = launchkey.placeMap[name].name;
      }
   }

   if (newId == nameId)
      return;
   else
      nameId = newId;

   if (null == nameId)
      outlet(0, ["setButton", 0]);
   else
      outlet(0, ["setButton", nameId]);

}
onclick.updateButtonId = 1;