autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "id");

outlets = 1;
setoutletassist(0, "id");

function msg_int(id) {
   post("padmap", id);
   post();

   outlet(0, 36);
}

