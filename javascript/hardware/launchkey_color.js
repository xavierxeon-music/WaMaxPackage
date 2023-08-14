autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list (id, color)");

outlets = 1;
setoutletassist(0, "list(id, color_index)");

include("_launchkey.js");

//////////////////////////////////////////

// set up
var launchkey = new Global("Launchkey");


var colorList = [];
var indexBuffer = {};
var whiteIndex = 0;

//////////////////////////////////////////


function loadbang() {
   init();
}

function init() {

   colorList = readJsonFile(jsarguments[1]);

   const white = new Color("ffffff");
   whiteIndex = findNearestMatchInColorList(white);
   //print("init white", white.hex, whiteIndex);

   indexBuffer[white.hex] = whiteIndex;


   for (var index = 0; index < colorList.length; index += 1) {

      const color = colorList[index];
      indexBuffer[color] = index;
   }

}

function color(nameId, inColor) {

   if (0 === nameId)
      return;

   if (launchkey.placeMap === null)
      return;

   var place = launchkey.placeMap[nameId];
   if (undefined === place)
      return false;


   var color_index = 0;

   var color = new Color(inColor);
   if (InputType.ColorButton = place.type)
      color_index = findNearestMatchInColorList(color);
   else if (InputType.GrayButton == place.type)
      color_index = color.luma();

   //print(inColor, color.hex, color_index);

   outlet(0, [nameId, color_index]);
}

function findNearestMatchInColorList(color) {

   if (colorList.length === 0) // need colorList to work with
      return whiteIndex;

   if (color.hex in indexBuffer)
      return indexBuffer[color.hex];

   var color_index = whiteIndex;

   var minDistance = 0;
   for (var index = 0; index < colorList.length; index += 1) {

      const test = colorList[index];
      const rgb = new Color(test);

      const distance = color.distance(rgb);

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }
   }

   //print("MATCH", color.hex, color_index);

   indexBuffer[color.hex] = color_index;
   return color_index;
}
findNearestMatchInColorList.local = 1;
