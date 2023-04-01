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
      10: false, // a#
      11: true // b
   };

   this.names = {
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
      "a#": 10,
      "b": 11
   }

   return this;
}

Scale.prototype.clear = function () {

   for (var index = 0; index < 12; index++)
      this.notes[index] = false;
}

Scale.prototype.setScale = function (text) {

   this.clear();

   if (13 != text.length) {
      post(text, "has wrong length", text.length, "\n");
      return;
   }

   if ("s" != text[0]) {
      post(text, "need to start with 's'", "\n");
      return;
   }

   for (var index = 0; index < 12; index++) {
      this.notes[index] = (1 == text[index + 1]);
   }
}

Scale.prototype.setPredefined = function (baseNote, major) {

   this.clear();

   var startIndex = this.names[baseNote];
   if (undefined === startIndex)
      return;

   if (major) {
      const majorNotes = [0, 2, 4, 5, 7, 9, 11];
      for (var offset in majorNotes) {
         var index = (startIndex + majorNotes[offset]) % 12;
         this.notes[index] = true;
      }
   }
   else {
      const minorNotes = [0, 2, 4, 6, 7, 9, 11];
      for (var offset in minorNotes) {
         var index = (startIndex + minorNotes[offset]) % 12;
         this.notes[index] = true;
      }
   }
}

Scale.prototype.closestMatch = function (midiNote) {
   // midi 0 = C-2
   var scaleNote = midiNote % 12;
   var octaveC = (midiNote - scaleNote);

   if (!this.notes[scaleNote]) {
      var up = 1;
      while (!this.notes[(scaleNote + up) % 12])
         up++;

      var down = 1;
      while (!this.notes[(scaleNote + 12 - down) % 12])
         down++;

      if (up >= down) { // move down
         scaleNote = (scaleNote + 12 - down) % 12;
      }
      else { // move up
         scaleNote = (scaleNote + up) % 12;
      }
      //post("non scale note", scaleNote, up, down, "\n");
   }

   return octaveC + scaleNote;
}