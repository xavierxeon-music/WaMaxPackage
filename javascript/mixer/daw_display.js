autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "update");

include("_portDevice.js");

//////////////////////////////////////////

// set up

var daw = new PortDevice("daw");
var portDict = new Dict("dawDisplay");

//////////////////////////////////////////

function loadbang() {

   daw.register(updateFunction);

   portDict.clear();
   updateFunction();
}

function notifydeleted() {

   daw.deregister();
}

updateFunction.local = 1;
function updateFunction() {

   // print("update"); daw.debug();

   daw.copyTo(portDict);
   outlet(0, "bang");
}



