//  rgb color 

function Color(text) {

   this.red = 0;
   this.green = 0;
   this.blue = 0;

   this.hex = "000000";

   if (!text)
      return undefined;

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
      return undefined;

   // check for hex content
   if (!isHex(text)) {
      print("not a hex value", text);
      return undefined;
   }

   this.hex = text;

   this.red = parseInt(text.substring(0, 2), 16);
   this.green = parseInt(text.substring(2, 4), 16);
   this.blue = parseInt(text.substring(4, 6), 16);

   return this;
}

Color.fromRGB = function (red, green, blue) {

   var hex = makeHex(red) + makeHex(green) + makeHex(blue);
   return new Color(hex);
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

Color.prototype.toHSV = function (extendedHue) {
   // see https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation

   // convert r,g,b [0,255] range to [0,1]
   var r = this.red / 255.0;
   var g = this.green / 255.0;
   var b = this.blue / 255.0;

   // get the min and max of r,g,b
   var max = Math.max(r, g, b);
   var min = Math.min(r, g, b);

   // lightness is the average of the largest and smallest color components
   var lum = max;
   var hue = 0;
   var sat = 0;

   if (max != min) { // no saturation if max == min
      var chroma = max - min; // chroma
      // saturation is simply the chroma scaled to fill
      // the interval [0, 1] for every combination of hue and lightness
      sat = chroma / lum;
      switch (max) {
         case r:
            hue = ((g - b) / chroma) % 6;
            break;
         case g:
            hue = ((b - r) / chroma) + 2;
            break;
         case b:
            hue = ((r - g) / chroma) + 4;
            break;
      }

      hue /= 6.0;
   }

   var h = Math.round(hue * 255);
   if (extendedHue)
      h = Math.round(hue * 255 * 256);

   var s = Math.round(sat * 255);
   var l = Math.round(lum * 255);

   return [h, s, l];
}
