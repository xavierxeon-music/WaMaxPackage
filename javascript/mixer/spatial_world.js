autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 0;
//setoutletassist(0, "text");

//////////////////////////////////////////

// set up

var spatial = new Global("SpatialWorld");
spatial.updateEmiiterCount = updateEmiiterCount;
spatial.updateReceiverCount = updateReceiverCount;

var valueMap = {}

//////////////////////////////////////////

function loadbang() {

   if (undefined == spatial.emitterList)
      spatial.emitterList = [];

   if (undefined == spatial.receiverList)
      spatial.receiverList = [];

}

function bang() {

   updateEmiiterCount();
   updateReceiverCount();
}

function setWorldValue(key, value) {

   valueMap[key] = value;
   updateReceiverCount();
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
      for (var key in valueMap) {
         var value = valueMap[key];
         receiver.passWorldValue(key, value);
      }
   }
}
