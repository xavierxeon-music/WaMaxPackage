autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "world value");

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


function notifydeleted() {

   removeFromArray(spatial.receiverList, this);
   if (undefined != spatial.updateReceiverCount)
      spatial.updateReceiverCount();
}


setChannelCount.local = 1;
function setChannelCount(total) {

   setMultiChannels(this, total, ["mc.mixdown~"]);
}

passWorldValue.local = 1;
function passWorldValue(name, value) {

   outlet(0, [name, value]);
}
