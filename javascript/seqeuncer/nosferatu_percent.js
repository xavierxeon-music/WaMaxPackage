autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "pitch");

var values = [];

function setValues(newValues) {

   values = newValues.split(" ");
}

function stageIndex(index) {

   var value = values[index];
   outlet(0, value);
}
