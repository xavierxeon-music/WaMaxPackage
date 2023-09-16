autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 2;
setoutletassist(0, "data");
setoutletassist(1, "color");

var offset = 0;
declareattribute("offset");


var row = 10;
var keyMap = {};


function setRow(value) {

   row = 10 * value;
   reset();
}

function reset() {

   outlet(1, [row + 1, "ffffaa"]);
   outlet(1, [row + 2, "ffffff"]);
   outlet(1, [row + 3, "ffffff"]);
   outlet(1, [row + 4, "ffffff"]);
   outlet(1, [row + 5, "ffffff"]);
   outlet(1, [row + 6, "ffffff"]);
   outlet(1, [row + 7, "ffffff"]);
   outlet(1, [row + 8, "ffffaa"]);

   outlet(1, [row + 10 + 2, "aaffff"]);
   outlet(1, [row + 10 + 3, "aaffff"]);
   outlet(1, [row + 10 + 5, "aaffff"]);
   outlet(1, [row + 10 + 6, "aaffff"]);
   outlet(1, [row + 10 + 7, "aaffff"]);

   keyMap[row + 1] = 24;
   keyMap[row + 2] = 26;
   keyMap[row + 3] = 28;
   keyMap[row + 4] = 29;
   keyMap[row + 5] = 31;
   keyMap[row + 6] = 33;
   keyMap[row + 7] = 35;
   keyMap[row + 8] = 36;

   keyMap[row + 10 + 2] = 25;
   keyMap[row + 10 + 3] = 27;
   keyMap[row + 10 + 5] = 30;
   keyMap[row + 10 + 6] = 32;
   keyMap[row + 10 + 7] = 34;
}

function list(id, value) {

   var pitch = keyMap[id];
   if (undefined == pitch)
      return;

   outlet(0, [pitch + offset, value]);
}
