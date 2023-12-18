autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list");

var buffer = new Buffer(jsarguments[1]);


function list() {

   var maxStep = buffer.framecount() / (arguments.length - 1);

   for (var index = 1; index < arguments.length; index++) {
      var valueA = arguments[index - 1];
      var valueB = arguments[index];
      var slope = (valueB - valueA) / maxStep;

      for (var step = 0; step < maxStep; step++) {
         var sampleIndex = (maxStep * (index - 1)) + step;
         var value = valueA + (step * slope);

         buffer.poke(0, sampleIndex, value);
      }
   }
}

