function Stage() {

   this.pitch = 0;
   this.propability = 0;
   this.count = 0;
   this.length = 0;

   this.current = 0;

   return this;
}

Stage.prototype.advance = function () {

   this.current++;
   if (this.current >= this.count) {
      this.current = 0;
      return true;
   }

   return false;
}

///////////////////////////////////////////////


autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message, phasor");

outlets = 3;
setoutletassist(0, "midiNote");
setoutletassist(1, "gate");
setoutletassist(2, "stage_count");

var stages = [];
var currentStageIndex = 0;
var stageCount = 0;

var tickCounter = 0;


function bang() {

   if (0 === tickCounter) {
      outlet(2, currentStageIndex);
      outlet(0, stages[currentStageIndex].pitch);

      if (stages[currentStageIndex].advance()) {
         currentStageIndex++;
         if (currentStageIndex >= stages.length)
            currentStageIndex = 0;
      }
   }

   var targetDuration = 8 * stages[currentStageIndex].count;
   var currentDuration = (8 * stages[currentStageIndex].current) + tickCounter;

   var percentage = currentDuration / targetDuration;
   if (percentage < stages[currentStageIndex].length)
      outlet(1, 1);
   else
      outlet(1, 0);

   tickCounter++;
   if (tickCounter >= 8)
      tickCounter = 0;
}

function signal(phasor) {

   if (0 === phasor)
      bang();
}

function setSize(value) {

   while (stages.length > value) {
      stages.pop();
   }

   for (var index = stages.length; index < value; index++)
      stages.push(new Stage());

   stageCount = value;
}

function pitchOffset(values) {

   var pitch = values.split(" ");
   setSize(pitch.length);

   for (var index = 0; index < pitch.length; index++)
      stages[index].pitch = pitch[index];
}

function propability(values) {

   var pr = values.split(" ");
   setSize(pr.length);

   for (var index = 0; index < pr.length; index++)
      stages[index].propability = pr[index] / 100.0;
}

function pulseCount(values) {

   var pc = values.split(" ");
   setSize(pc.length);

   for (var index = 0; index < pc.length; index++)
      stages[index].count = pc[index];
}

function gateLength(values) {

   var gl = values.split(" ");
   setSize(gl.length);

   for (var index = 0; index < gl.length; index++)
      stages[index].length = gl[index] / 100.0;
}


function reset() {

   post("reset", "\n");
   currentStageIndex = 0;
   outlet(2, currentStageIndex);
}
