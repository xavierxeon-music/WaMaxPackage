autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "length");

// data types

// a matrix of lanes (columns) and segments (rows) populated by stages
// buufers are created for each lane, length of buffer determined by combined lengths of all segmentCount
// buffers to be played by a 128n pahsor adjusted by totalLength

function Lane() {

   this.buffer = null;
   this.data = null;

   return this;
}

function Segment(length) {

   this.length = length;

   return this;
}


function Stage() {

   this.startValue = null;
   this.endValue = null;

   return this;
}

// variables

var fileName = null;
var contourOffset = 0;
var modificationDate = null;

var segmentCount = 0;
var totalLength = 0;

var lanes = [];
var segments = [];

// functions


function loadbang() {

   bang();
}

function bang() {

   var prefix = jsarguments[1];

   for (var index = 0; index < 8; index++) {

      var lane = new Lane()

      var name = prefix + "_contour" + (index + 1);
      lane.buffer = new Buffer(name);

      lanes.push(lane);
   }
}

function moddate(value) {

   if (value != modificationDate) {
      modificationDate = value;
      loadInternal();
   }
}

function read(newFileName, offset) {

   fileName = newFileName;
   contourOffset = offset;

   if (null != modificationDate)
      loadInternal();
}

function loadInternal() {

   print("read", fileName);

   var data = readJsonFile(fileName);
   var project = data["project"];

   segmentCount = parseInt(project["segments"]);
   var defaultLength = 8 * parseInt(project["division"]);

   segments = [];
   for (var index = 0; index < segmentCount; index++)
      segments.push(new Segment(defaultLength));

   var header = project["header"];
   for (var key in header) {

      var laneInfo = header[key];
      if ("length" in laneInfo) {
         var index = parseInt(key);
         segments[index].length = 8 * parseInt(laneInfo["length"]);
      }
   }

   totalLength = 0;
   for (var index = 0; index < segmentCount; index++)
      totalLength += segments[index].length;
   outlet(0, totalLength);

   if (0 === contourOffset)
      compileLaneData(data["contours"], 0);
   else
      compileLaneData(data["contours"], 8);
}
loadInternal.local = 1;

function compileLaneData(contours, offset) {

   for (var laneIndex = 0; laneIndex < 8; laneIndex++) {

      // create stages, first and last proxy
      var stages = [];
      for (var index = 0; index < segmentCount; index++) {
         var stage = new Stage();
         if (0 === index)
            stage.startValue = 0;
         else if (segmentCount === index + 1)
            stage.endValue = 0;
         stages.push(stage);
      }

      var laneKey = (laneIndex + offset).toString();
      if (1 == laneKey.length)
         laneKey = "lane0" + laneKey;
      else
         laneKey = "lane" + laneKey;

      // fill stages
      var lane = contours[laneKey];
      for (var key in lane) {

         if ("name" == key)
            continue;

         var segment = parseInt(key);
         var stage = stages[segment];

         var entry = parseInt(lane[key]);

         var startValue = getByte(entry, 0);
         var hasStartValue = getByte(entry, 1);
         if (hasStartValue)
            stage.startValue = startValue;

         var endValue = getByte(entry, 2);
         var hasEndValue = getByte(entry, 3);
         if (hasEndValue)
            stage.endValue = endValue;
      }

      // propagate end values
      for (var index = 1; index < segmentCount; index++) {

         var stagePrev = stages[index - 1];
         var stage = stages[index];

         if (stage.startValue !== null && stagePrev.endValue === null)
            stagePrev.endValue = stage.startValue;

      }

      var output = [];

      var startIndex = 0;
      for (var index = 0; index < segmentCount; index++) {

         var stage = stages[index];

         if (stage.startValue !== null)
            startIndex = index;

         if (stage.endValue !== null) {
            var duration = (1 + index - startIndex) * segments[index].length;
            var startStage = stages[startIndex];

            var startValue = startStage.startValue;
            var endValue = stage.endValue;

            output.push(duration);
            output.push(startValue);
            output.push(endValue);
         }
      }

      lanes[laneIndex].data = output;
   }

   updateBuffers();
}
compileLaneData.local = 1;

function updateBuffers() {

   for (var laneIndex = 0; laneIndex < 8; laneIndex++) {

      var buffer = lanes[laneIndex].buffer;
      var data = lanes[laneIndex].data;

      if (null === buffer || null == data)
         continue;

      buffer.send("clear");
      buffer.send("sizeinsamps", totalLength, 1);

      var bufferValue = [];
      for (var dataIndex = 0; dataIndex < data.length; dataIndex += 3) {
         var duration = parseInt(data[dataIndex + 0]);
         var startValue = parseFloat(data[dataIndex + 1]);
         var endValue = parseFloat(data[dataIndex + 2]);

         var diff = (endValue - startValue) / duration;

         //print(dataIndex, duration, startValue, endValue, diff);

         for (var index = 0; index < duration; index++) {
            var value = startValue + (index * diff);
            bufferValue.push(value / 256.0);
         }

      }
      buffer.poke(1, 0, bufferValue);
   }

}
updateBuffers.local = 1;

