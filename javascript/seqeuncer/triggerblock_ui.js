autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "gate");

include("_mapped_canvas.js");

//////////////////////////////////////////

var padSize = 8;
var margin = 1;
var mc = new MappedCanvas(this, 8 * padSize, 3 * padSize);

var currentColumn = 0;
var currentRow = 0;
var valueList = [];

var updateOnBang = false;


//////////////////////////////////////////

function bang() {

   if (updateOnBang) {
      currentColumn += 1;
      if (currentColumn >= 8) {
         currentColumn = 0;

         currentRow += 1;
         if (currentRow >= valueList.length)
            currentRow = 0;
      }
   }

   mc.draw();

   if (isActive(currentColumn, 0))
      outlet(0, 1);
   else
      outlet(0, 0);

   updateOnBang = true;
}

function add(value) {
   valueList.push(value);
   mc.draw();
}

function reset() {
   currentColumn = 0;
   currentRow = 0;
   updateOnBang = false;
   mc.draw();
}

function clear() {
   valueList = [];
   reset();
}

paint.local = 1;
function paint() {

   mc.setColor("111111");
   mc.drawRectangle(0, 0, 8 * padSize, 3 * padSize, true);

   var d = padSize - (2 * margin);
   for (var rowOffset = -1; rowOffset < 2; rowOffset++) {

      var y = ((rowOffset + 1) * padSize) + margin;
      for (var col = 0; col < 8; col++) {

         if (0 == rowOffset && col == currentColumn)
            mc.setColor("ffff00");
         else if (hasContent(rowOffset))
            mc.setColor("00ffff");
         else
            mc.setColor("777777");

         var x = (col * padSize) + margin;
         if (isActive(col, rowOffset))
            mc.drawRectangle(x, y, d, d, true);
         else
            mc.drawRectangle(x, y, d, d, false);
      }
   }
}

onresize.local = 1;
function onresize(w, h) {

   mc.draw();
}

isActive.local = 1;
function isActive(col, rowOffset) {

   if (!hasContent(rowOffset))
      return false;

   var value = valueList[currentRow + rowOffset];
   var mask = (1 << (7 - col));

   var test = (value & mask);

   var active = (0 != test);
   return active;
}

function hasContent(rowOffset) {

   if (0 == valueList.length)
      return false;

   var test = currentRow + rowOffset;
   if (test < 0)
      return false;

   if (test >= valueList.length)
      return false;

   return true;
}