autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

include("_mapped_canvas.js");
include("_launchkey.js");

//////////////////////////////////////////

// set up

function Input(x, y, inputInfo) {
   this.x = x;
   this.y = y;

   //this.color = "222222";
   this.color = "ff0000";
   this.type = inputInfo["type"];;

   return this;
}

var launchkey = new Global("Launchkey");
launchkey.gridSize = 5;
launchkey.gapSize = 1;
launchkey.device = null;
launchkey.inputMap = null;

var deviceWidth = (23 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;
var deviceHeight = (3 * (launchkey.gridSize + launchkey.gapSize)) + launchkey.gapSize;
print(deviceWidth, deviceHeight);

var mc = new MappedCanvas(this, deviceWidth, deviceHeight);

var midRow = [InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button];
var bottomRow = [InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button, InputType.Button];

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   launchkey.device = this;
   launchkey.inputMap = {};

   var index = 0;

   var deviceInfo = readJsonFile(jsarguments[1]);

   for (var xIndex = 0; xIndex < 23; xIndex++) {

      var colKey = compileKey(xIndex);
      var x = launchkey.gapSize + (xIndex * (launchkey.gridSize + launchkey.gapSize));

      for (var yIndex = 0; yIndex < 3; yIndex++) {

         var rowKey = compileKey(yIndex);
         var y = launchkey.gapSize + (yIndex * (launchkey.gridSize + launchkey.gapSize));
         y = deviceHeight - (y + launchkey.gridSize);

         var inputInfo = deviceInfo[rowKey][colKey];

         var input = new Input(x, y, inputInfo);
         launchkey.inputMap[index] = input;

         index++;
      }
   }

   mc.draw();

}

function list(id, color) {

   if (launchkey.inputMap === null)
      return;

   if (launchkey.inputMap[id] === undefined)
      return;

   launchkey.inputMap[id].color = color;
   mc.draw();
}


function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, deviceWidth, deviceHeight, true);

   if (launchkey.inputMap === null)
      return;


   for (index in launchkey.inputMap) {

      var input = launchkey.inputMap[index];
      mc.setColor(input.color);
      mc.drawRectangle(input.x, input.y, launchkey.gridSize, launchkey.gridSize, true);

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

function compileKey(value) {

   var text = value.toString();
   if (value < 10)
      text = "0" + text;

   return text;
}