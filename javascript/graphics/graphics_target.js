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
   for (var id = 0; 0 < objectIds.length; id += 1) {
      var key = objectIds[id];
      var object = target.get(key);
      if (null === object)
         break;

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


function drawCircle(object) {
   var xPos = object.get("x");
   var yPos = object.get("y");
   var radius = object.get("radius");

   var color = getColor(object.get("color"));

   var filled = ("1" == object.get("fill"));
   var radius2 = radius * radius;

   for (var x = xPos - radius; x <= xPos + radius; x += 1) {
      for (var y = yPos - radius; y <= yPos + radius; y += 1) {
         var xDiff = xPos - x;
         var yDiff = yPos - y;
         var dist2 = (xDiff * xDiff) + (yDiff * yDiff);
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

