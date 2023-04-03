function Stage() {

   this.count = 0;
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
setinletassist(0, "message, bang");

outlets = 2;
setoutletassist(0, "stage");
setoutletassist(1, "percentage");

var stages = [];
var currentStageIndex = 0;
var stageCount = 0;
var tickCounter = 0;

function bang() {

   if (0 === tickCounter) {
      outlet(0, currentStageIndex);

      if (stages[currentStageIndex].advance()) {
         currentStageIndex++;
         if (currentStageIndex >= stages.length)
            currentStageIndex = 0;
      }
   }

   var targetDuration = 8 * stages[currentStageIndex].count;
   var currentDuration = (8 * stages[currentStageIndex].current) + tickCounter;

   var percentage = currentDuration / targetDuration;
   outlet(1, percentage);

   tickCounter++;
   if (tickCounter >= 8)
      tickCounter = 0;
}

function setSize(value) {

   while (stages.length > value) {
      stages.pop();
   }

   for (var index = stages.length; index < value; index++)
      stages.push(new Stage());

   stageCount = value;
}

function pulseCount(values) {

   var pc = values.split(" ");
   setSize(pc.length);

   for (var index = 0; index < pc.length; index++)
      stages[index].count = pc[index];
}


function reset() {

   currentStageIndex = 0;
   outlet(0, currentStageIndex);
   outlet(1, 0.0);

   stageCount = 0;
   tickCounter = 0;
}

