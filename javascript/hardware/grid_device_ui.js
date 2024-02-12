autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

include("_mapped_canvas.js");

//////////////////////////////////////////

// set up

var padding = 5;
var indicatorSize = 15;
var textWidth = 80;

var deviceWidth = (4 * textWidth) + (2 * padding);
var deviceHeight = (8 * indicatorSize) + (2 * padding);

var mc = new MappedCanvas(this, deviceWidth, deviceHeight);

var colorMap = {};
var nameMap = {};
var valueMap = {};

//////////////////////////////////////////

function loadbang() {

   bang();
}

function bang() {

   // print(deviceWidth, deviceHeight);
   mc.draw();
}

function color(id, hexColor) {

   var color = new Color(hexColor);
   colorMap[id] = color.hex;
   mc.draw();
}

function name(id, text) {

   if (text.length > 10)
      text = text.substring(10);

   nameMap[id] = text;
   mc.draw();
}

function gridInput(id, value) {

   valueMap[id] = value;
   mc.draw();
}

paint.local = 1;
function paint() {

   mc.setFontSize(indicatorSize.toString() + "px");

   mc.setColor("111111");
   mc.drawRectangle(0, 0, deviceWidth, deviceHeight, true);

   for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
         var x = padding + row * textWidth;
         var y = padding + col * 2 * indicatorSize;

         var id = (row + 1) + 10 * (4 - col);

         mc.setColor("aaaaaa");
         mc.drawEllipse(x, y, 0.9 * indicatorSize, 0.9 * indicatorSize, true);

         if (id in colorMap)
            mc.setColor(colorMap[id]);
         else
            mc.setColor("111111");
         mc.drawEllipse(x + 1.5, y + 1.5, 0.7 * indicatorSize, 0.7 * indicatorSize, true);

         mc.setColor("eeeeee");

         var lineLength = 30;
         if (id in valueMap) {
            var text = valueMap[id].toString();
            mc.drawText(x + indicatorSize + padding, y + (0.7 * indicatorSize), text)

            var length = valueMap[id] * lineLength / 127;
            mc.drawRectangle((x + textWidth) - (lineLength + 5), y + 3, length, 5, true);
         }
         else
            mc.drawText(x + indicatorSize + padding, y + (0.7 * indicatorSize), "???")



         if (id in nameMap)
            mc.drawText(x, y + (1.7 * indicatorSize), nameMap[id]);
         else
            mc.drawText(x, y + (1.7 * indicatorSize), "---");
      }
   }

}