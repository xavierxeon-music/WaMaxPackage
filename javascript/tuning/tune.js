autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "lookup/nearest");

outlets = 1;
setoutletassist(0, "frequency");

// data

include("_tuning.js")
var tuning = new Global("Tuning");

var myName = "main";

function setName(name) {

   myName = name;
}

function lookup(index) {

   if (tuning[myName] == undefined)
      return 0.0;

   var frequency = tuning[myName].lookupIndex(index);
   outlet(0, frequency);
}

function nearest(value) {

   if (tuning[myName] == undefined)
      return 0.0;

   var frequency = tuning[myName].nearestFrequency(value);
   outlet(0, frequency);
}


