autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

var scales = new Global("Scales");
var scaleName = "main";
var rootNote = "c";
var isMajor = true;

// set up jsui defaults to 2d
sketch.default2d();
var xList = [-2.5, -2.0, -1.75, -1.25, -1.0, 0.0, 0.5, 0.75, 1.25, 1.5, 2.0, 2.25];
var yList = [-0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5];

function loadbang() {

   Ui.setSize(this, 150, 50);
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

   draw();
}

function major(enabled) {

   isMajor = (1 === enabled);

   maybeCreate();
   myScale().setPredefined(rootNote, isMajor);

   draw();
}

function scale(text) {

   maybeCreate();
   myScale().setScale(text);

   draw();
}

function enable(note) {

   setNote(note, true);

   draw();
}

function disable(note) {

   setNote(note, false);

   draw();
}

function clear() {

   maybeCreate();
   myScale().clear();

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

   if (undefined === myScale())
      return;

   for (var index = 0; index < 12; index++) {

      if (myScale().notes[index])
         sketch.glcolor(0.5, 0.7, 0.3);
      else
         sketch.glcolor(0.7, 0.5, 0.3);
      sketch.moveto(xList[index], yList[index]);
      sketch.cube(0.3);
   }

   refresh();
}
draw.local = 1;

function onclick(x, y) {

   var point = sketch.screentoworld(x, y);
   post("CLICK", point[0], "/", point[1], x, y, "\n");

   for (var index = 0; index < 12; index++) {

      var xMin = xList[index];
      var xMax = xList[index] + 0.6;
      post(index, "x =>", xMin, " -", xMax, "\n");

      if (point[0] < xMin)
         continue;
      if (point[0] > xMax)
         continue;
      post("X match", index, "\n");

      var yMin = yList[index] - 0.6;
      var yMax = yList[index];
      post(index, "y =>", yMin, " -", yMax, "\n");

      if (point[1] < yMin)
         continue;
      if (point[1] > yMax)
         continue;

      var note = myScale().notes[index];
      post("MATCH", index, note, "\n");
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

   if (w === 3 * h) {
      draw();
   }
   else {
      Ui.setSize(this, 3 * h, h);
   }
}
onresize.local = 1;

function maybeCreate() {

   if (undefined === scales.target)
      scales.target = {};

   if (undefined === scales.target[scaleName])
      scales.target[scaleName] = new Scale();
}
maybeCreate.local = 1;
