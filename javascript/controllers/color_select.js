autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list (id, color)");

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

var white_index = 0;

function loadbang() {

   var text = "";
   var file = new File(jsarguments[1], "read");
   while (file.isopen && file.position < file.eof) {
      text += file.readline();
   }
   file.close();

   colorList = JSON.parse(text);
   white_index = getColorRGB("ffffff");
}

function list(id, color) {

   var color_index = white_index;
   if (color in colorNames)
      color_index = getColorRGB(colorNames[color]);
   else if (isHex(color))
      color_index = getColorRGB(color);

   outlet(0, [id, color_index]);
}

// str match not workling!
function isHex(color) {

   if (color.length != 6) return false;

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

// TODO: buffer map
function getColorRGB(color) {

   var color_index = 0;

   var color_red = parseInt(color.substring(0, 2), 16);
   var color_green = parseInt(color.substring(2, 4), 16);
   var color_blue = parseInt(color.substring(4, 6), 16);


   var minDistance = 0;
   for (var index = 0; index < colorList.length; index += 1) {

      var test = colorList[index];
      var test_red = parseInt(test.substring(0, 2), 16);
      var test_green = parseInt(test.substring(2, 4), 16);
      var test_blue = parseInt(test.substring(4, 6), 16);

      var diff_red = color_red - test_red;
      var diff_green = color_green - test_green;
      var diff_blue = color_blue - test_blue;

      var distance = diff_red * diff_red + diff_green * diff_green + diff_blue * diff_blue;

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }
   }

   //post("MATCH", color , color_index, "\n");

   return color_index;
}
getColorRGB.local = 1;
