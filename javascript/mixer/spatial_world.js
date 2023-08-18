autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "text");

//////////////////////////////////////////

// set up

var spatial = new Global("SpatialWorld");
spatial.updateEmiiterCount = updateEmiiterCount;
spatial.updateReceiverCount = updateReceiverCount;

//////////////////////////////////////////

function loadbang() {

   if (undefined == spatial.emitterList)
      spatial.emitterList = [];

   if (undefined == spatial.receiverList)
      spatial.receiverList = [];

}

function bang() {

   print("hello?");
   updateEmiiterCount();
}

updateEmiiterCount.local = 1;
function updateEmiiterCount() {

   for (var index in spatial.emitterList) {
      var emitter = spatial.emitterList[index];
      emitter.setChannel(index, spatial.emitterList.length);
   }

   updateReceiverCount();
}

updateReceiverCount.local = 1;
function updateReceiverCount() {

   var total = spatial.emitterList.length;
   for (var index in spatial.receiverList) {
      var receiver = spatial.receiverList[index];
      receiver.setChannelCount(total);
   }
}
