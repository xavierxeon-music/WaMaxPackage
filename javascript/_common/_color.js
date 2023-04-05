//  rgb color 

function Color(text) {

   this.red = 0;
   this.green = 0;
   this.blue = 0;

   this.hex = "000000";

   if (null === text)
      return;

   const colorNames = {
      off: "000000",
      red: "ff0000",
      green: "00ff00",
      blue: "0000ff",
      yellow: "ffff00",
      magenta: "ff00ff",
      cyan: "00ffff",
      white: "ffffff"
   };

   // substitute predefined names
   if (text in colorNames)
      text = colorNames[text];

   if (text.length != 6)
      return;

   // check for hex content
   for (var index = 0; index < 6; index += 1) {

      var test = text[index];
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

   this.hex = text;

   this.red = parseInt(text.substring(0, 2), 16);
   this.green = parseInt(text.substring(2, 4), 16);
   this.blue = parseInt(text.substring(4, 6), 16);

   return this;
}

Color.prototype.distance = function (other) {

   const diff_red = this.red - other.red;
   const diff_green = this.green - other.green;
   const diff_blue = this.blue - other.blue;

   const distance = (diff_red * diff_red) + (diff_green * diff_green) + (diff_blue * diff_blue);

   return distance;
}

Color.prototype.luma = function () {

   // Photometric/digital ITU BT.709
   const luma = (this.red + this.red + this.blue + this.green + this.green + this.green) / 12;
   return luma;
}