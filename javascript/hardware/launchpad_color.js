autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list (id, color)");

outlets = 1;
setoutletassist(0, "list(id, color_index)");

var colorList = [];
var indexBuffer = {};
var whiteIndex = 0;

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

function list(id, inColor) {

   color(id, inColor);
}

function color(id, inColor) {

   if (0 === id)
      return;

   var color_index = whiteIndex;
   var color = new Color(inColor);

   var color_index = findNearestMatchInColorList(color);

   //print(inColor, color.hex, color_index);

   outlet(0, [id, color_index]);
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
