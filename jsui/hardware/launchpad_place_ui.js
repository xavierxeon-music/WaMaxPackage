autowatch = 1;

// inlets and outlets
outlets = 1;
setoutletassist(0, "id");

include("_mapped_canvas.js");


//////////////////////////////////////////

// set up
var launchpad = new Global("Launchpad");
var buttonSize = launchpad.buttonSize + (2 * launchpad.gapSize);

var mc = new MappedCanvas(this, buttonSize, buttonSize);

var id = null;

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

   if (null == id)
      outlet(0, ["setButton", 0]);
   else
      outlet(0, ["setButton", id]);


   mc.draw();
}

function list(changedId, color) {

   if (changedId === id)
      mc.draw();
}

function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, buttonSize, buttonSize, true);

   var color = "222222";
   if (null !== id && launchpad.buttonMap && launchpad.buttonMap[id])
      color = launchpad.buttonMap[id].color;

   mc.setColor(color);
   mc.drawRectangle(launchpad.gapSize, launchpad.gapSize, launchpad.buttonSize, launchpad.buttonSize, true);
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
   if (null == my_rect)
      return;

   var parent_rect = getPresentationRectanlge(launchpad.device);
   if (null == parent_rect)
      return;


   var gridSize = my_rect[2];

   var diffX = my_rect[0] - parent_rect[0];
   var diffY = my_rect[1] - parent_rect[1];

   var xIndex = Math.floor(diffX / gridSize);
   var yIndex = 8 - Math.floor(diffY / gridSize);

   var newId = null;

   if (xIndex >= 0 || xIndex < 9 || yIndex >= 0 || yIndex < 9) {
      newId = (10 * (yIndex + 1)) + (xIndex + 1);
   }

   if (newId == id)
      return;
   else
      id = newId;

   if (null == id)
      outlet(0, ["setButton", 0]);
   else
      outlet(0, ["setButton", id]);

}
onclick.updateButtonId = 1;