autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "update");

include("_portDevice.js");

//////////////////////////////////////////

// set up

var rack = new PortDevice("small_rack");
var portDict = new Dict("smallRackDisplay", updateFunction);

//////////////////////////////////////////

function loadbang() {

   rack.register(updateFunction);

   portDict.clear();
   updateFunction();
}

function notifydeleted() {

   rack.deregister();
}

updateFunction.local = 1;
function updateFunction() {

   // print("update"); rack.debug();

   rack.copyTo(portDict);
   outlet(0, "bang");
}



