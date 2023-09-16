autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "event");

var scheduleFile = null;

function create() {

   print("create");
}

function read(fileName) {

   scheduleFile = fileName;
   print("read", fileName);
   reload();
}

function time(bars, beats) {

   print("time", bars, beats);
}

function reload() {

   print("reload", scheduleFile);
   if (!scheduleFile)
      return;
}

