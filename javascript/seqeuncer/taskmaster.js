autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "event");

var scheduleFile = null;
var schedule = {};

function create() {

   dummy = { "1.1": ["A", "B"] };
   saveJsonFile(dummy, scheduleFile);
   // print("create", scheduleFile);
}

function read(fileName) {

   scheduleFile = fileName;
   reload();
}

function time(bars, beats) {

   var key = bars + "." + beats;
   eventList = schedule[key]
   if (undefined == eventList)
      return;

   for (index in eventList) {

      var event = eventList[index];
      outlet(0, event);
   }
}

function reload() {

   if (!scheduleFile)
      return;

   schedule = readJsonFile(scheduleFile);
}

