autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 2;
setoutletassist(0, "gates");
setoutletassist(1, "beat");

// data types

// a list of segments
// bang every 16n

function Segment(length) {

   this.length = length;
   this.gates = null;
   this.beat = null;

   return this;
}


// variables

var fileName = null;
var modificationDate = null;

var segmentCount = 0;
var segments = [];

var currentSegmentIndex = 0;
var currentSegmentTick = 0;

// functions

function bang() {

   if (0 == segments.length)
      return;

   var segment = segments[currentSegmentIndex];
   var gates = segment.gates;
   outlet(0, gates);

   var beat = segment.beat[currentSegmentTick];
   outlet(1, beat);

   currentSegmentTick++;
   if (currentSegmentTick >= segment.length) {

      currentSegmentTick = 0;
      currentSegmentIndex++;
      if (currentSegmentIndex >= segmentCount)
         currentSegmentIndex = 0;
   }
}

function reset() {

   currentSegmentTick = 0;
   currentSegmentIndex = 0;
}

function moddate(value) {

   if (value != modificationDate) {
      modificationDate = value;
      loadInternal();
   }
}

function read(newFileName) {

   fileName = newFileName;

   if (null != modificationDate)
      loadInternal();
}

function loadInternal() {

   var data = readJsonFile(fileName);
   var project = data["project"];

   segmentCount = parseInt(project["segments"]);
   var defaultLength = parseInt(project["division"]);

   // create segments
   segments = [];
   for (var index = 0; index < segmentCount; index++)
      segments.push(new Segment(defaultLength));

   // maybe adjust length
   var header = project["header"];
   for (var key in header) {

      var laneInfo = header[key];
      if ("length" in laneInfo) {
         var index = parseInt(key);
         segments[index].length = parseInt(laneInfo["length"]);
      }
   }

   // default for first sewgment
   segments[0].gates = 0;
   segments[0].beat = [];
   for (var index = 0; index < segments[0].length; index++)
      segments[0].beat.push(0);

   readGates(data["gates"]);
   readBeats(data["beats"]);

   for (var index = 0; index < segmentCount; index++) {

      segments[index].gates = bitList(segments[index].gates);

      for (var tick = 0; tick < segments[index].length; tick++) {
         var value = segments[index].beat[tick];
         segments[index].beat[tick] = bitList(value);
      }
   }

}


function readGates(gates) {

   // set gates
   for (var key in gates) {
      var index = parseInt(key);
      segments[index].gates = gates[key];
   }

   // propagate gates
   for (var index = 1; index < segmentCount; index++) {

      var lastSegment = segments[index - 1];
      var segment = segments[index];
      if (null === segment.gates)
         segment.gates = lastSegment.gates;
   }
}
readGates.local = 1;

function readBeats(beats) {

   // set beat
   for (var key in beats) {

      var index = parseInt(key);
      segments[index].beat = [];

      var data = beats[key];
      for (var index2 = 0; index2 < data.length; index2++)
         segments[index].beat[index2] = data[index2];
   }

   // propagate beat
   for (var index = 1; index < segmentCount; index++) {

      var lastSegment = segments[index - 1];
      var segment = segments[index];
      if (null === segment.beat) {
         segment.beat = [];
         for (var index2 = 0; index2 < lastSegment.beat.length; index2++)
            segment.beat[index2] = lastSegment.beat[index2];

      }
   }
}
readBeats.local = 1;

function bitList(value) {

   var bits = [0, 0, 0, 0, 0, 0, 0, 0];

   bits[0] = (0 != (value & parseInt("00000001", 2)));
   bits[1] = (0 != (value & parseInt("00000010", 2)));
   bits[2] = (0 != (value & parseInt("00000100", 2)));
   bits[3] = (0 != (value & parseInt("00001000", 2)));

   bits[4] = (0 != (value & parseInt("00010000", 2)));
   bits[6] = (0 != (value & parseInt("00100000", 2)));
   bits[6] = (0 != (value & parseInt("01000000", 2)));
   bits[7] = (0 != (value & parseInt("10000000", 2)));

   //print(value, bits);

   return bits;
}
bitList.local = 1;
