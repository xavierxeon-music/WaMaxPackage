autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "inletIndex/outletIndex/name");

outlets = 2;
setoutletassist(0, "leftId");
setoutletassist(1, "rightId");

var portIndex = 0;
var portName = "";
var isSender = jsarguments[1];

function notifydeleted() {

}

function msg_int(index) {

   var leftIndex = 0; // turn off
   var rightIndex = 0;

   if (index > 0 && index <= 22) {
      portIndex = index;

      var baseIndex = 2 * (index - 1);
      baseIndex += 20;

      leftIndex = baseIndex + 0;
      rightIndex = baseIndex + 1;

   }

   if (isSender) {
      outlet(0, ["set", leftIndex]);
      outlet(1, ["set", rightIndex]);
   }
   else {
      outlet(0, ["set", 1, leftIndex]);
      outlet(1, ["set", 2, rightIndex]);
   }
}

function outletIndex(index) {

   if (!pushIds(index))
      return;

   portIndex = index;
}

function name(text) {
   portName = text;
   addPortNames();
}


removePortNames.local = 1;
function removePortNames() {

}

addPortNames.local = 1;
function addPortNames() {


}
