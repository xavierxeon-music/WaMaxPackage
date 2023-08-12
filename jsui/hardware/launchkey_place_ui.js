autowatch = 1;

// inlets and outlets
outlets = 1;
setoutletassist(0, "id");

include("_mapped_canvas.js");
include("_launchkey.js");

//////////////////////////////////////////

// set up
var launchkey = new Global("Launchkey");
var buttonSize = launchkey.buttonSize + (2 * launchkey.gapSize);

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

function list(changedId, color) {

   if (changedId === nameId)
      mc.draw();
}

function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, buttonSize, buttonSize, true);

   var color = "ff0000";
   /*
   if (null !== id && launchkey.buttonMap && launchkey.buttonMap[id])
      color = launchkey.buttonMap[id].color;
   */

   mc.setColor(color);
   mc.drawRectangle(launchkey.gapSize, launchkey.gapSize, launchkey.buttonSize, launchkey.buttonSize, true);
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

   var my_rect = getPresentationRectanlge(this);
   var parent_rect = getPresentationRectanlge(launchkey.device);

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