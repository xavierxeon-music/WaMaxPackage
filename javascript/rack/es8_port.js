autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "int/name");

outlets = 1;
setoutletassist(0, "id");

include("_portDevice.js");

/*
(omnibus id)(port)

ES8
to computer: oni 3-6 =  1-4
from computer (isSender): omni 3-10 = 1-8

*/

//////////////////////////////////////////

// set up

var rack = new PortDevice("es8");

var portIndex = undefined;
var portName = undefined;
var isSender = jsarguments[1];

//////////////////////////////////////////

function loadbang() {

   rack.register();
}

function notifydeleted() {

   rack.removePortName(portIndex, isSender);

   rack.deregister();
}

function setIndex(index) {

   // turn off old index
   rack.removePortName(portIndex, isSender);

   var maxId = isSender ? 4 : 8;
   if (index <= 0 || index > maxId)
      return;

   var omniIndex = index + 2;
   portIndex = index;

   if (isSender) {
      outlet(0, ["set", omniIndex]);
   }
   else {
      outlet(0, ["set", 1, omniIndex]);
   }

   rack.addPortName(portIndex, portName, isSender);
}


function name(text) {

   portName = text;
   rack.addPortName(portIndex, portName, isSender);
}
