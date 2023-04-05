autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

include("_scale.js");
include("_canvas.js");

//////////////////////////////////////////




//////////////////////////////////////////

var scales = new Global("Scales");
var scaleName = "main";
var rootNote = "c";
var isMajor = true;

// set up
canvas = new Canvas(this, 155, 45);
var cubeSide = 15;
var xList = [5, 15, 25, 35, 45, 75, 85, 95, 105, 115, 125, 135];
var yList = [25, 5, 25, 5, 25, 25, 5, 25, 5, 25, 5, 25];

function loadbang() {

   canvas.draw();
}

function bang() {

   canvas.draw();
}

function getvalueof() {

   maybeCreate();

   return myScale().getScale();
}

function setvalueof(value) {

   maybeCreate();

   myScale().setScale(value)
   canvas.draw();
}

function name(text) {

   scaleName = text;

   maybeCreate();
   canvas.draw();
}

function root(note) {

   rootNote = note;

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   canvas.draw();
}

function major(enabled) {

   isMajor = (1 === enabled);

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   canvas.draw();
}

function scale(text) {

   maybeCreate();
   myScale().setScale(text);

   notifyclients();
   canvas.draw();
}

function enable(note) {

   setNote(note, true);

   notifyclients();
   canvas.draw();
}

function disable(note) {

   setNote(note, false);

   notifyclients();
   canvas.draw();
}

function clear() {

   maybeCreate();
   myScale().clear();

   notifyclients();
   canvas.draw();
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
         canvas.setColor("556655");
      else
         canvas.setColor("bbbbbb");

      canvas.drawRectangle(xList[index], yList[index], cubeSide, cubeSide, true);
   }
}
paint.local = 1;

function onclick(x, y) {

   var point = canvas.screenToCanvas(x, y);
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

   canvas.draw();
}
onclick.local = 1;

function onresize(w, h) {

   canvas.draw();
}
onresize.local = 1;

function maybeCreate() {

   if (undefined === scales.target)
      scales.target = {};

   if (undefined === scales.target[scaleName])
      scales.target[scaleName] = new Scale();
}
maybeCreate.local = 1;
