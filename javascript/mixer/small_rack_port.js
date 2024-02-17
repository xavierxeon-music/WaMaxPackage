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
to computer: 3-6 , 1-4
from computer (isSender): 3-10 , 1-8

Optix
to computer: 7-14 , 1-8
from computer (isSender): 11-18 , 1-8
*/

//////////////////////////////////////////

// set up

var rack = new PortDevice("small_rack");

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

function setIndex(indexText) {

   rack.removePortName(portIndex, isSender);

   var index = compileOminbusIndex(indexText); // turn off

   if (isSender) {
      outlet(0, ["set", index]);
   }
   else {
      outlet(0, ["set", 1, index]);
   }

   rack.addPortName(portIndex, portName, isSender);
}


function name(text) {

   portName = text;
   rack.addPortName(portIndex, portName, isSender);
}

compileOminbusIndex.local = 1;
function compileOminbusIndex(indexText) {

   var destination = indexText[0].toLowerCase();
   if (destination != "e" && destination != "o")
      return 0;

   var portId = parseInt(indexText.substring(1));

   var maxId = destination == "re" ? 4 : 8;
   print("setIndex", destination, portId, maxId);
   if (portId <= 0 || portId > maxId)
      return 0;

   portIndex = destination + portId.toString();

   if (destination == "o") {
      if (isSender)
         return portId + 10;
      else
         return portId + 6;
   }
   else {
      if (isSender)
         return portId + 2;
      else
         return portId + 2;
   }

   return 0;
}