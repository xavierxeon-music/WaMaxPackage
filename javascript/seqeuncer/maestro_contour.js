autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 1;
setoutletassist(0, "buffer_length");

// data types

// a list of segments
// a buufer is created, length of buffer determined by combined lengths of all segmentCount
// buffers to be played by a 128n pahsor adjusted by totalLength

function Segment(length) {

   this.length = length;
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

var segments = [];

// functions

function moddate(value) {

   if (value == modificationDate)
      return;


   modificationDate = value;
   loadInternal();
}

function offset(value) {

   if (value == contourOffset)
      return;

   contourOffset = value;
   loadInternal();
}

function read(newFileName) {

   if (newFileName == undefined)
      return;

   fileName = newFileName;

   if (null != modificationDate)
      loadInternal();
}

function loadInternal() {

   //print("read", fileName);

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

   var output = compileData(data["contours"]);
   updateBuffers(output);
}
loadInternal.local = 1;

function compileData(contoursData) {

   //  first and last proxy
   segments[0].startValue = 0;
   segments[segmentCount - 1].endValue = 0;


   var laneKey = contourOffset.toString();
   if (1 == laneKey.length)
      laneKey = "lane0" + laneKey;
   else
      laneKey = "lane" + laneKey;

   // fill proxies
   var laneData = contoursData[laneKey];
   for (var key in laneData) {

      if ("name" == key)
         continue;

      var segmentIndex = parseInt(key);
      var proxy = segments[segmentIndex];

      var entry = parseInt(laneData[key]);

      var startValue = getByte(entry, 0);
      var hasStartValue = getByte(entry, 1);
      if (hasStartValue)
         proxy.startValue = startValue;

      var endValue = getByte(entry, 2);
      var hasEndValue = getByte(entry, 3);
      if (hasEndValue)
         proxy.endValue = endValue;
   }

   // propagate end values
   for (var index = 1; index < segmentCount; index++) {

      var proxyPrev = segments[index - 1];
      var proxy = segments[index];

      if (proxy.startValue !== null && proxyPrev.endValue === null)
         proxyPrev.endValue = proxy.startValue;

   }

   var output = [];

   var startIndex = 0;
   for (var index = 0; index < segmentCount; index++) {

      var proxy = segments[index];

      if (proxy.startValue !== null)
         startIndex = index;

      if (proxy.endValue !== null) {
         var duration = (1 + index - startIndex) * segments[index].length;
         var startproxy = segments[startIndex];

         var startValue = startproxy.startValue;
         var endValue = proxy.endValue;

         output.push(duration);
         output.push(startValue);
         output.push(endValue);
      }
   }

   return output;
}
compileData.local = 1;

function updateBuffers(data) {

   if (null == data)
      return;

   var prefix = jsarguments[1];
   var name = prefix + "_contour";
   buffer = new Buffer(name);

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
updateBuffers.local = 1;

