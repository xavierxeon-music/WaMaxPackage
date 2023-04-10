autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "title");

function bang() {

   outlet(0, patcher.name);
}

