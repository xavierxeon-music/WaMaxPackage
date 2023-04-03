autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "gate");

var gateLengths = [];
var currentIndex = 0;


function gateLength(values) {

   gateLengths = values.split(" ");
   for (var index = 0; index < gateLengths.length; index++)
      gateLengths[index] = gateLengths[index] / 100.0;
}

function stageIndex(index) {

   currentIndex = index;
}


function stagePercentage(percentage) {

   if (percentage < gateLengths[currentIndex])
      outlet(0, 1);
   else
      outlet(0, 0);

}

