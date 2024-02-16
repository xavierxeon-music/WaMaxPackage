autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "update");

include("_daw.js");

//////////////////////////////////////////

// set up

var portDict = new Dict("dawDisplay");

daw.updateFunction = function () {

   //print("update");
   //daw.debug();

   portDict.clear();

   for (var key in daw.portDict) {
      var name = daw.portDict[key];
      portDict.set(key, name);
   }

   outlet(0, "bang");
}

//////////////////////////////////////////

function loadbang() {

   daw.register();

   portDict.clear();
   daw.updateFunction();
}

function notifydeleted() {

   daw.deregister();
}


