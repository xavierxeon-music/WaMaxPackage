autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "title");

var embedded = false;
declareattribute("embedded");

function bang() {

   if (embedded)
      outlet(0, patcher.parentpatcher.name);
   else
      outlet(0, patcher.name);
}

