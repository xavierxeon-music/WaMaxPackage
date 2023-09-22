autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

function liveSet(value) {

   if ("notfound" == value)
      return;

   value = value.replace("ExternalData:", "/Volumes/ExternalData");
   outlet(0, value);
}

