// a scale

function Scale() {

   // default is s major
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

   const names = {
      "c": 0,
      "c#": 1,
      "d": 2,
      "d#": 3,
      "e": 4,
      "f": 5,
      "f#": 6,
      "g": 7,
      "g#": 8,
      "a": 9,
      "a#": 10
   }

   return this;
}

Scale.prototype.clear() = function () {
   for (var index = 0; index < 11; index++)
      notes[index] = false;
}

Scale.prototype.setPredifined = function (baseNote, major = true) {

   clear();

   if (false === baseNote in names)
      return;

   var startIndex = names[baseNote];

   if (major) {
      const majorNotes = [0, 2, 4, 5, 7, 9];
      for (var offset in majorNotes) {
         var index = (startIndex + offset) % 11;
         notes[index] = true;
      }
   }
   else {
      const minorNotes = [0, 2, 4, 6, 7, 9];
      for (var offset in minorNotes) {
         var index = (startIndex + offset) % 11;
         notes[index] = true;
      }
   }
}

Scale.prototype.closestMatch = function (midiNote) {
   return 0;
}