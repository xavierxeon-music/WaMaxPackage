autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 3;
setoutletassist(0, "length");
setoutletassist(1, "buffer_size");
setoutletassist(2, "values");

// data types

// a list and segments populated by units
// bang every 16n

function Unit() {

   this.propability = 0.0;
   this.value1 = 36;
   this.length = 0.0;
   this.value2 = 0;

   this.active = true;

   return this;
}


function Segment(length) {

   this.units = null;
   this.length = length;

   return this;
}

// variables

var fileName = null;
var stageOffset = 0;
var modificationDate = null;

var segmentCount = 0;
var segments = [];
var totalLength = 0;

var currentSegmentIndex = 0;
var currentSegmentTick = 0;

var subTickCount = 32;

// functions

function bang() {

   if (0 === segments.length)
      return;

   var segment = segments[currentSegmentIndex];

   var unit = segment.units[currentSegmentTick];
   var length = unit.length;
   var value1 = unit.value1;
   var propability = unit.propability;
   var value2 = unit.value2;

   outlet(2, [value1, value2])

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

function offset(value) {

   if (value == stageOffset)
      return;

   stageOffset = value;
   loadInternal();
}

function read(newFileName) {

   fileName = newFileName;

   if (null != modificationDate)
      loadInternal();
}

function loadInternal() {

   var data = readJsonFile(fileName);
   var project = data["project"];

   segments = [];

   segmentCount = parseInt(project["segments"]);
   if (0 == segmentCount)
      return;

   var defaultLength = parseInt(project["division"]);
   for (var index = 0; index < segmentCount; index++) {
      segments.push(new Segment(defaultLength));
   }

   var header = project["header"];
   for (var key in header) {

      var laneInfo = header[key];
      if ("length" in laneInfo) {
         var index = parseInt(key);
         segments[index].length = parseInt(laneInfo["length"]);
      }
   }

   totalLength = 0;
   for (var index = 0; index < segmentCount; index++)
      totalLength += segments[index].length;
   outlet(0, totalLength);
   outlet(1, subTickCount * totalLength);


   var stagesData = data["stages"];
   var laneKey = stageOffset.toString();
   if (1 == laneKey.length)
      laneKey = "lane0" + laneKey;
   else
      laneKey = "lane" + laneKey;

   var laneData = stagesData[laneKey];
   // read data
   for (var key in laneData) {

      if ("name" == key)
         continue;

      var segmentIndex = parseInt(key);
      var segment = segments[segmentIndex];
      //print("parse segment", segmentIndex);

      var unitArray = laneData[key];
      if (unitArray.length != segment.length) {
         segment.units = null;
         continue;
      }
      else {
         segment.units = [];
      }


      for (var unitIndex = 0; unitIndex < segment.length; unitIndex++) {
         var unitStore = parseInt(unitArray[unitIndex]);

         var unit = new Unit();
         unit.propability = getByte(unitStore, 0) / 255.0;
         unit.value1 = getByte(unitStore, 1);
         unit.length = getByte(unitStore, 2) / 255.0;
         unit.value2 = getByte(unitStore, 3);

         segment.units.push(unit);
      }
   }

   fillEmptySegments();
   updateBuffer();
}
loadInternal.local = 1;

function fillEmptySegments() {

   // set start units (if not present)
   var firstSegment = segments[0];
   if (null === firstSegment.units) {
      //print("fill first sgment");
      firstSegment.units = [];
      for (var unitIndex = 0; unitIndex < firstSegment.length; unitIndex++) {
         var unit = new Unit();
         firstSegment.units.push(unit);
      }
   }

   // propagate units
   for (var index = 1; index < segmentCount; index++) {

      var lastSegment = segments[index - 1];
      var segment = segments[index];
      if (null === segment.units) {
         //print("copy segment from ", index - 1, " to ", index);
         segment.units = [];
         for (var index2 = 0; index2 < lastSegment.units.length; index2++)
            segment.units[index2] = lastSegment.units[index2];

      }
   }
}
fillEmptySegments.local = 1;

function updateBuffer() {

   var prefix = jsarguments[1];
   var name = prefix + "_stage";
   buffer = new Buffer(name);

   buffer.send("clear");
   buffer.send("sizeinsamps", subTickCount * totalLength, 1);

   var bufferValue = [];
   for (var index = 0; index < segmentCount; index++) {

      var segment = segments[index];
      for (var tick = 0; tick < segment.units.length; tick++) {

         var unitLength = segment.units[tick].length;
         for (var subTick = 0; subTick < subTickCount; subTick++) {

            var percentage = subTick / subTickCount;
            if (percentage < unitLength)
               bufferValue.push(1);
            else
               bufferValue.push(0);
         }
      }
   }
   buffer.poke(1, 0, bufferValue);
}
updateBuffer.local = 1;
