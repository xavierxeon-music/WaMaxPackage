autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "list (isColor, id, color)");

outlets = 1;
setoutletassist(0, "list(id, color_index)");

include("_color.js");

var colorList = [];
var colorIndexBuffer = {};
var colorWhiteIndex = 0;

var whiteList = [];
var whiteIndexBuffer = {};

function loadbang() {

   const white = new Color("ffffff");
   colorWhiteIndex = findNearestMatchInColorList(white);
   colorIndexBuffer[white.hex] = colorWhiteIndex;

   var text = "";
   var file = new File(jsarguments[1], "read");
   while (file.isopen && file.position < file.eof) {
      text += file.readline();
   }
   file.close();
   colorList = JSON.parse(text);

   for (var index = 0; index < colorList.length; index += 1) {

      const color = colorList[index];
      colorIndexBuffer[color] = index;
   }

   if (3 == jsarguments.length) { // optional white list 
      var text = "";
      var file = new File(jsarguments[2], "read");
      while (file.isopen && file.position < file.eof) {
         text += file.readline();
      }
      file.close();

      whiteList = JSON.parse(text);

      whiteIndexBuffer["000000"] = 0;
      whiteIndexBuffer["ffffff"] = 127;
   }
}

function list(isColor, id, inColor) {

   var color = new Color(inColor);

   if (1 === isColor) {

      var color_index = findNearestMatchInColorList(color);
      outlet(0, [id, color_index]);
   }
   else {

      var color_index = findNearestMatchInWhiteList(color);
      outlet(0, [id, color_index]);
   }
}

function findNearestMatchInColorList(color) {

   if (colorList.length === 0) // need colorList to work with
      return colorWhiteIndex;

   if (color.hex in colorIndexBuffer)
      return colorIndexBuffer[color.hex];

   var color_index = colorWhiteIndex;
   var minDistance = 0;
   for (var index = 0; index < colorList.length; index++) {

      const test = colorList[index];
      const rgb = new Color(test);

      const distance = color.distance(rgb);

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }
   }

   //post("MATCH", color , color_index, "\n");

   colorIndexBuffer[color.hex] = color_index;
   return color_index;
}
findNearestMatchInColorList.local = 1;

function findNearestMatchInWhiteList(color) {

   if (whiteList.length === 0) // need whiteList to work with
      return 127;

   if (color.hex in whiteIndexBuffer)
      return whiteIndexBuffer[color.hex];

   const luma = color.luma();

   var white__index = 127;
   for (var index = 1; index < whiteList.length; index++) {
      const last = whiteList[index - 1];
      const current = whiteList[index];
      if (luma > last && luma <= current) {
         white__index = index;
         break;
      }
   }

   //post(color, luma,  white__index, "\n");
   whiteIndexBuffer[color.hex] = white__index;
   return white__index;
}
findNearestMatchInWhiteList.local = 1;

