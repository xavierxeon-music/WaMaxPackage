autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

include("_scale.js");
include("_mapped_canvas.js");


//////////////////////////////////////////

var scales = new Global("Scales");

var scaleName = "main";
var rootNote = "c";
var isMajor = true;

// set up
var cubeSide = 15;
var xList = [5, 15, 25, 35, 45, 75, 85, 95, 105, 115, 125, 135];
var yList = [25, 5, 25, 5, 25, 25, 5, 25, 5, 25, 5, 25];

var mc = new MappedCanvas(this, 155, 45);

//////////////////////////////////////////

function loadbang() {

   mc.draw();
}

function bang() {

   mc.draw();
}

function getvalueof() {

   maybeCreate();

   return myScale().getScale();
}

function setvalueof(value) {

   maybeCreate();

   myScale().setScale(value)
   mc.draw();
}

function name(text) {

   scaleName = text;

   maybeCreate();
   mc.draw();
}

function root(note) {

   rootNote = note;

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   mc.draw();
}

function major(enabled) {

   isMajor = (1 === enabled);

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   mc.draw();
}

function scale(text) {

   maybeCreate();
   myScale().setScale(text);

   notifyclients();
   mc.draw();
}

function enable(note) {

   setNote(note, true);

   notifyclients();
   mc.draw();
}

function disable(note) {

   setNote(note, false);

   notifyclients();
   mc.draw();
}

function clear() {

   maybeCreate();
   myScale().clear();

   notifyclients();
   mc.draw();
}

function myScale() {

   if (scales.target === undefined)
      return undefined;

   return scales.target[scaleName];
}
myScale.local = 1;

function setNote(note, enabled) {

   maybeCreate();

   var noteIndex = Scale.names[note];
   if (undefined === noteIndex)
      return;

   var notes = myScale().notes;
   notes[noteIndex] = enabled;
}
setNote.local = 1;


function paint() {

   if (undefined === myScale())
      return;

   for (var index = 0; index < 12; index++) {

      if (myScale().notes[index])
         mc.setColor("556655");
      else
         mc.setColor("bbbbbb");

      mc.drawRectangle(xList[index], yList[index], cubeSide, cubeSide, true);
   }
}
paint.local = 1;

function onclick(x, y) {

   var point = mc.screenToCanvas(x, y);
   for (var index = 0; index < 12; index++) {

      var xMin = xList[index];
      var xMax = xList[index] + cubeSide;
      //post(index, "x =>", xMin, " -", xMax, "\n");

      if (point[0] < xMin)
         continue;
      if (point[0] > xMax)
         continue;
      //post("X match", index, "\n");

      var yMin = yList[index];
      var yMax = yList[index] + cubeSide;
      //post(index, "y =>", yMin, " -", yMax, "\n");

      if (point[1] < yMin)
         continue;
      if (point[1] > yMax)
         continue;

      var note = myScale().notes[index];
      //post("MATCH", index, note, "\n");
      if (note)
         myScale().notes[index] = false;
      else
         myScale().notes[index] = true;

      break;
   }

   mc.draw();
}
onclick.local = 1;

function onresize(w, h) {

   mc.draw();
}
onresize.local = 1;

function maybeCreate() {

   if (undefined === scales.target)
      scales.target = {};

   if (undefined === scales.target[scaleName])
      scales.target[scaleName] = new Scale();
}
maybeCreate.local = 1;
