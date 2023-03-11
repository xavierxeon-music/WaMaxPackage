autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "color");

outlets = 1;
setoutletassist(0, "id");

var colorList = [];


function loadbang() {

   var text = "";
   var file = new File(jsarguments[1], "read");
   while (file.isopen && file.position < file.eof) {
      text += file.readline();
   }
   file.close();

   colorList = JSON.parse(text);
}

// TODO: buffer map
function getColor(color) {

   var color_index = 0;

   const color_red = parseInt(color.substring(0, 2), 16);
   const color_green = parseInt(color.substring(2, 4), 16);
   const color_blue = parseInt(color.substring(4, 6), 16);

   var minDistance = 0;
   for (var index = 0; index < colorList.length; index += 1) {
      const test = colorList[index];
      const test_red = parseInt(test.substring(0, 2), 16);
      const test_green = parseInt(test.substring(2, 4), 16);
      const test_blue = parseInt(test.substring(4, 6), 16);

      const diff_red = color_red - test_red;
      const diff_green = color_green - test_green;
      const diff_blue = color_blue - test_blue;

      const distance = (diff_red * diff_red) + (diff_green * diff_green) + (diff_blue * diff_blue);

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }

   }

   //post("getColor", color, color_index);

   outlet(0, color_index)
}
