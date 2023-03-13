autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang, dimensions");

outlets = 1;
setoutletassist(0, "message");

var graphics = new Global("graphics");


function dimensions(x, y) {

   outlet(0, ["dim", x, y]);
   bang();
}

function bang() {

   outlet(0, ["clear"]);
   outlet(0, ["brgb", 0, 0, 0]);

   var objectIds = Object.keys(graphics.target);
   if (objectIds === null) // no objects
      return;

   for (var index = 0; index < objectIds.length; index++) {
      var id = objectIds[index];
      var object = graphics.target[id];

      var type = object["type"];
      if (type === undefined)
         continue;

      if ("circle" === type)
         drawCircle(object);
      else if ("box" === type)
         drawBox(object);
      else if ("line" === type)
         drawLine(object);
      else if ("text" === type)
         drawText(object);
   }
}

function getColor(text) {
   var red = 0;
   var green = 0;
   var blue = 0;

   if (null !== text) {
      red = parseInt(text.substring(0, 2), 16);
      green = parseInt(text.substring(2, 4), 16);
      blue = parseInt(text.substring(4, 6), 16);

   }

   return [red, green, blue];
}
drawCircle.local = 1;

function checkKeys(object, keyList) {

   if (object == null)
      return false;

   for (var i = 0; i < keyList.length; i += 1) {
      var key = keyList[i];
      if (object[key] === undefined)
         return false;
   }

   return true;
}
checkKeys.local = 1;


function drawCircle(object) {

   if (!checkKeys(object, ["x", "y", "radius", "color", "fill"]))
      return;

   const x = parseInt(object["x"]);
   const y = parseInt(object["y"]);
   const radius = parseInt(object["radius"]);

   const color = getColor(object["color"]);

   const filled = ("1" == object["fill"]);

   if (filled)
      outlet(0, ["paintoval", x - radius, y - radius, x + radius, y + radius, color[0], color[1], color[2]]);
   else
      outlet(0, ["frameoval", x - radius, y - radius, x + radius, y + radius, color[0], color[1], color[2]]);
}
drawCircle.local = 1;

function drawBox(object) {

   if (!checkKeys(object, ["x", "y", "width", "height", "color", "fill"]))
      return;

   const x = parseInt(object["x"]);
   const y = parseInt(object["y"]);
   const width = parseInt(object["width"]);
   const height = parseInt(object["height"]);

   const color = getColor(object["color"]);

   const filled = ("1" == object["fill"]);

   outlet(0, ["frgb", color[0], color[1], color[2]]);

   if (filled)
      outlet(0, ["paintrect", x, y, x + width, y + height]);
   else
      outlet(0, ["framerect", x, y, x + width, y + height]);
}
drawBox.local = 1;

function drawLine(object) {

   if (!checkKeys(object, ["xStart", "yStart", "xEnd", "yEnd", "color"]))
      return;

   const xStart = parseInt(object["xStart"]);
   const yStart = parseInt(object["yStart"]);

   const xEnd = parseInt(object["xEnd"]);
   const yEnd = parseInt(object["yEnd"]);

   const color = getColor(object["color"]);

   outlet(0, ["frgb", color[0], color[1], color[2]]);

   outlet(0, ["moveto", xStart, yStart]);
   outlet(0, ["lineto", xEnd, yEnd]);
}
drawCircle.drawLine = 1;

function drawText(object) {

   if (!checkKeys(object, ["x", "y", "fontSize", "text", "color"]))
      return;

   const x = parseInt(object["x"]);
   const y = parseInt(object["y"]);

   const fontSize = parseInt(object["fontSize"]);
   const text = object["text"].replace("\,", " ");

   const color = getColor(object["color"]);

   outlet(0, ["frgb", color[0], color[1], color[2]]);

   outlet(0, ["moveto", x, y + fontSize]);
   outlet(0, ["font", "Arial", fontSize]);
   outlet(0, ["write", text]);
}
drawCircle.drawText = 1;