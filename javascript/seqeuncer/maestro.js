autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 8;
for (var index = 0; index < 8; index++)
   setoutletassist(index, "data" + (index + 1));

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

// variables

var mode = Mode.RampA;
var division = 0; // ticks per segment
var segments = 0;

function loadbang() {

   var test = jsarguments[1];
   if (Mode.RampB == test)
      mode = Mode.RampB;
   if (Mode.Gates == test)
      mode = Mode.Gates;
   if (Mode.Beat == test)
      mode = Mode.Beat;
   else
      mode = Mode.RampA;
}

function read(fileName) {

   print(mode);

   var data = readJsonFile(fileName);
   var project = data["project"];

   division = 8 * parseInt(project["division"]);
   segments = parseInt(project["segments"]);
   print(segments, " @ ", division, "ticks");

   if (Mode.RampA === mode)
      readContours(project["contours"], 0);
   else if (Mode.RampB === mode)
      readContours(project["contours"], 8);

}

function readContours(contours, offset) {

   for (var lane = 0; lane < 8; lane++) {

      var stages = [];

      for (var index = 0; index < segments; index++) {
         var stage = new Stage();
         if (0 === index)
            stage.startValue = 0;
         else if (segments === index + 1)
            stage.endValue = 0;
         stages.push(stage);
      }

      var countour = contours[offset + lane];
      for (var key in countour) {

         if ("name" == key)
            continue;

         var segment = parseInt(key);
         var entry = countour[key];

         if ("start" in entry)
            stages[segment].startValue = parseInt(entry["start"]);
         if ("end" in entry)
            stages[segment].endValue = parseInt(entry["end"]);
         if ("steady" in entry)
            stages[segment].steady = (1 == entry["steady"]);

      }

      for (var index = 1; index < segments; index++) {

         if (stages[index].startValue !== null && stages[index - 1].endValue === null)
            stages[index - 1].endValue = stages[index].startValue;
      }

      var output = [];

      var startIndex = 0;
      for (var index = 0; index < segments; index++) {

         var stage = stages[index];
         if (stage.startValue !== null)
            startIndex = index;

         if (stage.endValue !== null) {
            var duration = (1 + index - startIndex) * division;
            var startValue = stages[startIndex].startValue;
            var endValue = startValue;
            if (!stages[startIndex].steady)
               endValue = stage.endValue;

            output.push(duration);
            output.push(startValue);
            output.push(endValue);
         }
      }

      outlet(lane, output);
   }
}
readContours.local = 1;

function loop(enabled) {

   looping = (1 === enabled);
   print("loop", looping);
}

function reset(doit) {

   print("reset", doit);
}

