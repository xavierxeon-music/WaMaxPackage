autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "length");

// data types

var Mode = {
   RampA: "rampA",
   RampB: "rampB",
   Gates: "gates",
   Beat: "beats"
};

function Stage() {

   this.startValue = null;
   this.endValue = null;
   this.steady = false;

   return this;
}

function Lane() {

   this.buffer = null;
   this.data = null;
}

// variables

var mode = Mode.RampA;
var prefix = "???";
var division = 0; // ticks per segment
var segments = 0;

var lanes = [new Lane(), new Lane(), new Lane(), new Lane(), new Lane(), new Lane(), new Lane(), new Lane()];

function loadbang() {

   bang();
}

function bang() {

   var test = jsarguments[1];
   if (Mode.RampB === test)
      mode = Mode.RampB;
   else if (Mode.Gates === test)
      mode = Mode.Gates;
   else if (Mode.Beat === test)
      mode = Mode.Beat;
   else
      mode = Mode.RampA;

   prefix = jsarguments[2];

   for (var index = 0; index < 8; index++) {

      var name = prefix + "_contour" + (index + 1);
      lanes[index].buffer = new Buffer(name);

      //print(name);
   }
}

function read(fileName) {

   // print(sampleRate, mode, prefix);

   var data = readJsonFile(fileName);
   var project = data["project"];

   division = 8 * parseInt(project["division"]);
   segments = parseInt(project["segments"]);
   //print(segments, " @ ", division, "ticks");

   var totalLength = division * segments;
   outlet(0, totalLength);

   if (Mode.RampA === mode)
      readContours(project["contours"], 0);
   else if (Mode.RampB === mode)
      readContours(project["contours"], 8);

}

function readContours(contours, offset) {

   for (var laneIndex = 0; laneIndex < 8; laneIndex++) {

      var stages = [];

      for (var index = 0; index < segments; index++) {
         var stage = new Stage();
         if (0 === index)
            stage.startValue = 0;
         else if (segments === index + 1)
            stage.endValue = 0;
         stages.push(stage);
      }

      var countour = contours[offset + laneIndex];
      for (var key in countour) {

         if ("name" == key)
            continue;

         var segment = parseInt(key);
         var entry = countour[key];

         var stage = stages[segment];

         if ("start" in entry)
            stage.startValue = parseInt(entry["start"]);
         if ("end" in entry)
            stage.endValue = parseInt(entry["end"]);
         if ("steady" in entry)
            stage.steady = (1 == entry["steady"]);

      }

      for (var index = 1; index < segments; index++) {

         var stagePrev = stages[index - 1];
         var stage = stages[index];

         if (stage.startValue !== null && stagePrev.endValue === null)
            stagePrev.endValue = stage.startValue;
      }

      var output = [];

      var startIndex = 0;
      for (var index = 0; index < segments; index++) {

         var stage = stages[index];
         if (stage.startValue !== null)
            startIndex = index;

         if (stage.endValue !== null) {
            var duration = (1 + index - startIndex) * division;
            var startStage = stages[startIndex];

            var startValue = startStage.startValue;
            var endValue = startValue;
            if (!startStage.steady)
               endValue = stage.endValue;

            output.push(duration);
            output.push(startValue);
            output.push(endValue);
         }
      }

      lanes[laneIndex].data = output;
   }

   updateBuffers();
}
readContours.local = 1;

function updateBuffers() {

   for (var laneIndex = 0; laneIndex < 8; laneIndex++) {

      var buffer = lanes[laneIndex].buffer;
      var data = lanes[laneIndex].data;

      if (null === buffer || null == data)
         continue;

      buffer.send("clear");

      var totalLength = division * segments;
      buffer.send("sizeinsamps", totalLength, 1);

      // print(" * lane ", laneIndex, ", lenght = ", totalLength);

      var bufferValue = [];
      for (var dataIndex = 0; dataIndex < data.length; dataIndex += 3) {
         var duration = parseInt(data[dataIndex + 0]);
         var startValue = parseFloat(data[dataIndex + 1]);
         var endValue = parseFloat(data[dataIndex + 2]);

         var diff = (endValue - startValue) / duration;

         for (var index = 0; index < duration; index++) {
            var value = startValue + (index * diff);
            bufferValue.push(value / 256.0);
         }

      }
      buffer.poke(1, 0, bufferValue);
   }

}
updateBuffers.local = 1;

