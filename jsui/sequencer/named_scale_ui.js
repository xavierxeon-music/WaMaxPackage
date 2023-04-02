autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

var scales = new Global("Scales");
var scaleName = "main";
var rootNote = "c";
var isMajor = true;

// set up
canvas = new Canvas(this, 160, 55);
var cubeSide = 18;
var xList = [3, 13, 23, 33, 43, 73, 83, 93, 103, 113, 123, 133];
var yList = [28, 5, 28, 5, 28, 28, 5, 28, 5, 28, 5, 28];

function loadbang() {

   draw();
}

function bang() {

   draw();
}

function getvalueof() {

   maybeCreate();

   return myScale().getScale();
}

function setvalueof(value) {

   maybeCreate();

   myScale().setScale(value)
   draw();
}

function name(text) {

   scaleName = text;

   maybeCreate();
   draw();
}

function root(note) {

   rootNote = note;

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   draw();
}

function major(enabled) {

   isMajor = (1 === enabled);

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   notifyclients();
   draw();
}

function scale(text) {

   maybeCreate();
   myScale().setScale(text);

   notifyclients();
   draw();
}

function enable(note) {

   setNote(note, true);

   notifyclients();
   draw();
}

function disable(note) {

   setNote(note, false);

   notifyclients();
   draw();
}

function clear() {

   maybeCreate();
   myScale().clear();

   notifyclients();
   draw();
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


// draw -- main graphics function
function draw() {

   sketch.glclear();
   sketch.default2d();

   if (undefined === myScale())
      return;

   var worldCubeSide = canvas.canvasToSketchDimension(sketch, cubeSide, cubeSide);
   var cubeHafSide = worldCubeSide[0] / 2;

   for (var index = 0; index < 12; index++) {

      if (myScale().notes[index])
         sketch.glcolor(0.5, 0.7, 0.3);
      else
         sketch.glcolor(0.7, 0.5, 0.3);

      var screenPoint = canvas.canvasToScreen(xList[index], yList[index]);
      var worldPoint = sketch.screentoworld(screenPoint[0], screenPoint[1]);

      sketch.moveto(worldPoint[0] + cubeHafSide, worldPoint[1] - cubeHafSide);
      sketch.cube(cubeHafSide);
   }

   refresh();
}
draw.local = 1;

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

   draw();
}
onclick.local = 1;

function onresize(w, h) {

   draw();
}
onresize.local = 1;

function maybeCreate() {

   if (undefined === scales.target)
      scales.target = {};

   if (undefined === scales.target[scaleName])
      scales.target[scaleName] = new Scale();
}
maybeCreate.local = 1;