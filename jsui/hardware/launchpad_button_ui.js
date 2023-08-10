autowatch = 1;

// inlets and outlets
outlets = 1;
setoutletassist(0, "id");

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
var buttonSize = launchpad.buttonSize + 2 * launchpad.gapSize;

var mc = new MappedCanvas(this, buttonSize, buttonSize);


//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {


   mc.draw();

}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, buttonSize, buttonSize, true);

   var id = launchpad.getButtonId(0, 0);
   var color = launchpad.getButtonColor(id);

   mc.setColor(color);
   mc.drawRectangle(launchpad.gapSize, launchpad.gapSize, launchpad.buttonSize, launchpad.buttonSize, true);
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