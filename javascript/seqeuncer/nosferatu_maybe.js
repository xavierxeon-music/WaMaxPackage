autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "gate_index");

var stagePropabilities = [];

function propability(values) {

   stagePropabilities = values.split(" ");

   for (var index = 0; index < stagePropabilities.length; index++)
      stagePropabilities[index] = stagePropabilities[index] / 100.0;
}

function stageIndex(index) {

   var target = stagePropabilities[index];
   var random = Math.random();

   if (random < target)
      outlet(0, 1); // pass
   else
      outlet(0, 2); // off

}
