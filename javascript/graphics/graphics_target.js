autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "dimensions");

outlets = 1;
setoutletassist(0, "matrix");

var target = new Dict("graphics_target");
var screen = null;


function dimensions(x, y) {
   screen = new JitterMatrix(4, "char", x, y);
   screen.setall(255, 0, 0, 0)
   bang();
}

function bang() {
   if (screen === null)
      return;

   screen.setall(255, 0, 0, 0);

   var objectIds = target.getkeys();
   for (var id = 0; id < objectIds.length; id += 1) {
      var key = objectIds[id];
      var object = target.get(key);

      if (!checkKeys(object, ["type"]))
         return;

      var type = object.get("type");
      if ("circle" === type)
         drawCircle(object);
   }

   outlet(0, "jit_matrix", screen.name)
}

function getColor(text) {
   var red = 0;
   var green = 0;
   var blue = 0;

   if (null !== text) {
      var red = parseInt(text.substring(0, 2), 16);
      var green = parseInt(text.substring(2, 4), 16);
      var blue = parseInt(text.substring(4, 6), 16);

   }

   return [red, green, blue];
}
drawCircle.local = 1;

function checkKeys(object, keyList) {

   if (object == null)
      return false;

   for (var i = 0; i < keyList.length; i += 1) {
      var key = keyList[i];
      if (!object.contains(key))
         return false;
   }

   return true;
}
checkKeys.local = 1;


function drawCircle(object) {

   if (!checkKeys(object, ["x", "y", "radius", "color", "fill"]))
      return;

   const xPos = parseInt(object.get("x"));
   const yPos = parseInt(object.get("y"));
   const radius = parseInt(object.get("radius"));

   const color = getColor(object.get("color"));

   const filled = ("1" == object.get("fill"));
   const radius2 = radius * radius;

   const xMin = xPos - radius;
   const xMax = xPos + radius;

   for (var x = xMin; x <= xMax; x += 1) {
      const xDiff = xPos - x;

      for (var y = yPos - radius; y <= yPos + radius; y += 1) {
         const yDiff = yPos - y;
         const dist2 = (xDiff * xDiff) + (yDiff * yDiff);

         if (filled) {
            if (dist2 > radius2)
               continue;
         }
         else {
            if ((dist2 - radius2) * (dist2 - radius2) > 2 * radius)
               continue;

         }

         screen.setcell2d(x, y, 255, color[0], color[1], color[2]);
      }
   }
}
drawCircle.local = 1;

