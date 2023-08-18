autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 0;
//setoutletassist(0, "channels");

include("_spatial.js");

//////////////////////////////////////////

// set up

var spatial = new Global("SpatialWorld");

//////////////////////////////////////////

function loadbang() {

   if (undefined == spatial.receiverList)
      spatial.receiverList = [];

   spatial.receiverList.push(this);
   if (undefined != spatial.updateReceiverCount)
      spatial.updateReceiverCount();
}

function bang() {

   post("bang");
}

function notifydeleted() {

   removeFromArray(spatial.receiverList, this);
   if (undefined != spatial.updateReceiverCount)
      spatial.updateReceiverCount();
}


setChannelCount.local = 1;
function setChannelCount(total) {

   setMultiChannels(this, total);

}
