autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "list (isColor, id, color)");

outlets = 1;
setoutletassist(0, "list(id, color_index)");

var colorList = [];
var colorNames = {
   off: "000000",
   red: "ff0000",
   green: "00ff00",
   blue: "0000ff",
   yellow: "ffff00",
   magenta: "ff00ff",
   cyan: "00ffff",
   white: "ffffff"
};
var colorIndexBuffer = {};
var colorWhiteIndex = 0;

var whiteList = [];
var whiteIndexBuffer = {};

function loadbang() {

   var text = "";
   var file = new File(jsarguments[1], "read");
   while (file.isopen && file.position < file.eof) {
      text += file.readline();
   }
   file.close();

   colorList = JSON.parse(text);

   colorWhiteIndex = findNearestMatchInColorList("ffffff");
   colorIndexBuffer["ffffff"] = colorWhiteIndex;
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

   var color = inColor;
   if (color in colorNames)
      color = colorNames[color];

   if (1 === isColor) {

      var color_index = colorWhiteIndex;

      if (isHex(color))
         color_index = findNearestMatchInColorList(color);

      outlet(0, [id, color_index]);
   }
   else {
      var color_index = 127;

      if (isHex(color))
         color_index = findNearestMatchInWhiteList(color);

      outlet(0, [id, color_index]);
   }
}

// str match not workling!
function isHex(color) {

   if (color.length != 6)
      return false;

   for (var index = 0; index < 6; index += 1) {

      var test = color[index];
      switch (test) {
         case "0":
         case "1":
         case "2":
         case "3":
         case "4":
         case "5":
         case "6":
         case "7":
         case "8":
         case "9":
         case "a":
         case "b":
         case "c":
         case "d":
         case "e":
         case "f":
            continue;
         default:
            return false;
      }
   }

   return true;
}
isHex.local = 1;

function findNearestMatchInColorList(color) {

   if (colorList.length === 0) // need colorList to work with
      return 0;

   if (color in colorIndexBuffer)
      return colorIndexBuffer[color];


   const color_red = parseInt(color.substring(0, 2), 16);
   const color_green = parseInt(color.substring(2, 4), 16);
   const color_blue = parseInt(color.substring(4, 6), 16);

   var color_index = 0;
   var minDistance = 0;
   for (var index = 0; index < colorList.length; index++) {

      const test = colorList[index];
      const test_red = parseInt(test.substring(0, 2), 16);
      const test_green = parseInt(test.substring(2, 4), 16);
      const test_blue = parseInt(test.substring(4, 6), 16);

      const diff_red = color_red - test_red;
      const diff_green = color_green - test_green;
      const diff_blue = color_blue - test_blue;

      const distance = diff_red * diff_red + diff_green * diff_green + diff_blue * diff_blue;

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }
   }

   //post("MATCH", color , color_index, "\n");

   colorIndexBuffer[color] = color_index;
   return color_index;
}
findNearestMatchInColorList.local = 1;

function findNearestMatchInWhiteList(color) {

   if (whiteList.length === 0) // need whiteList to work with
      return 0;

   if (color in whiteIndexBuffer)
      return whiteIndexBuffer[color];

   const red = parseInt(color.substring(0, 2), 16);
   const green = parseInt(color.substring(2, 4), 16);
   const blue = parseInt(color.substring(4, 6), 16);

   // Photometric/digital ITU BT.709
   const luma = (red + red + blue + green + green + green) / 12;

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
   whiteIndexBuffer[color] = white__index;
   return white__index;
}
findNearestMatchInWhiteList.local = 1;

