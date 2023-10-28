autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, bang");

outlets = 1;
setoutletassist(0, "text");

function Pattern(data) {

   this.length = 0;
   this.loop = false;
   this.values = [];

   if (data) {
      this.length = data['length'];
      this.loop = (1 == data['loop']);
      this.values = data['values'];
   }

   this.current = 0;

   return this;
}

Pattern.prototype.advance = function () {

   if (!this.loop && this.current >= this.length)
      return;

   // bang

   this.current += 1;
   if (this.current >= this.length) {
      if (this.loop)
         this.current = 0;
   }

}



var patternStore = {};
var patternCurrent = {};


var timePoint = "1.1"



function bang() {

   for (var tag in patternCurrent) {
      pattern = patternCurrent[tag];
      pattern.advance();
   }
}

function time(bar, beat) {

   var tp = bar.toString() + "." + beat.toString();
   tpData = patternStore[tp];
   if (!tpData)
      return;

   for (var tag in tpData) {
      pattern = tpData[tag];
      patternCurrent[tag] = pattern;
      print(pattern, tag);
   }
}

function load(fileName) {

   var content = readJsonFile(fileName);
   for (var tag in content) {
      tagData = content[tag];
      for (var tp in tagData) {
         patternData = tagData[tp];
         if (!patternStore[tp])
            patternStore[tp] = {};
         patternStore[tp][tag] = new Pattern(patternData);
      }
   }
   // printObject(patternStore, "load");
}

function restart() {

   timePoint = "1.1"
   patternCurrent = {};
}
