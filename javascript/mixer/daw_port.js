autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "int/name");

outlets = 2;
setoutletassist(0, "leftId");
setoutletassist(1, "rightId");

include("_portDevice.js");

//////////////////////////////////////////

// set up

var daw = new PortDevice("daw");

var portIndex = undefined;
var portName = undefined;
var isSender = jsarguments[1];

//////////////////////////////////////////

function loadbang() {

   daw.register();
}

function notifydeleted() {

   daw.removePortName(portIndex, isSender);

   daw.deregister();
}

function msg_int(index) {

   daw.removePortName(portIndex, isSender);

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

   daw.addPortName(portIndex, portName, isSender);
}


function name(text) {
   portName = text;
   daw.addPortName(portIndex, portName, isSender);
}
