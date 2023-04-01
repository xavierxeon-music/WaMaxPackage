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

function setSize(width, height) {

   box.rect = [box.rect[0], box.rect[1], box.rect[0] + width, box.rect[1] + height];
}

function loadbang() {

   setSize(150, 50);
   draw();
   refresh();
}

function name(text) {

   scaleName = text;
   maybeCreate();
   draw();
   refresh();
}

function root(note) {
   maybeCreate();
   rootNote = note;
   scales.target[scaleName].setPredefined(rootNote, isMajor);
   draw();
   refresh();
}

function major(enabled) {
   maybeCreate();
   isMajor = (1 === enabled);
   scales.target[scaleName].setPredefined(rootNote, isMajor);
   draw();
   refresh();
}

function scale(text) {
   maybeCreate();
   scales.target[scaleName].setScale(text);
   draw();
   refresh();
}


// draw -- main graphics function
function draw() {

   sketch.glclear();

   if (scales.target === undefined) {
      return;
   }

   var scale = scales.target[scaleName];
   if (scale === undefined) {
      return;
   }

   const x = [-2.5, -2.0, -1.75, -1.25, -1.0, 0.0, 0.5, 0.75, 1.25, 1.5, 2.0, 2.25];
   const y = [-0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5];
   for (var index = 0; index < 12; index++) {

      if (scale.notes[index])
         sketch.glcolor(0.5, 0.7, 0.3);
      else
         sketch.glcolor(0.7, 0.5, 0.3);
      sketch.moveto(x[index], y[index]);
      sketch.cube(0.3);
   }
}
draw.local = 1;

function onclick(x, y) {

   sketch.moveto(sketch.screentoworld(x, y))
   sketch.framecircle(1.0)
   refresh()
}
onclick.local = 1;

function onresize(w, h) {

   if (w === 3 * h) {
      draw();
      refresh();
   }
   else {
      setSize(3 * h, h);
   }
}
onresize.local = 1;

function maybeCreate() {

   if (scales.target === undefined) {
      scales.target = {};
      //post("init target", "\n");
   }

   if (scales.target[scaleName] === undefined)
      scales.target[scaleName] = new Scale();
}
maybeCreate.local = 1;
