autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 2;
setoutletassist(0, "pitch");
setoutletassist(1, "velocity");

function bang() {
   print("bang");
}

function load(fileName) {

   print("LOAD", fileName);
}

