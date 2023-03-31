// a scale

function Scale() {

   this.notes = {
      0: true, // c
      1: false, // c#
      2: true, // d
      3: false, // d#
      4: true, // e
      5: true, // f
      6: false, // f#
      7: true, //  g
      8: false, // g#
      9: true, // a
      10: false // a#
   };
   return this;
}

Scale.prototype.setPredifined = function (name) {
   // read dict and set notes
}

Scale.prototype.closestMatch = function (midiNote) {
   return 0;
}