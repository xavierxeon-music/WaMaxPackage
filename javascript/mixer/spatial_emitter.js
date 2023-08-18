autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 1;
setoutletassist(0, "mask");

include("_spatial.js");

//////////////////////////////////////////

// set up

var spatial = new Global("SpatialWorld");

//////////////////////////////////////////

function loadbang() {

   if (undefined == spatial.emitterList)
      spatial.emitterList = [];

   spatial.emitterList.push(this);
   if (undefined != spatial.updateEmiiterCount)
      spatial.updateEmiiterCount();
}

function bang() {

   print("bang");

}

function notifydeleted() {

   removeFromArray(spatial.emitterList, this);
   if (undefined != spatial.updateEmiiterCount)
      spatial.updateEmiiterCount();
}

setChannel.local = 1;
function setChannel(index, total) {

   setMultiChannels(this, total);

   var mask = [];
   for (var counter = 0; counter < total; counter++) {
      var value = (counter == index);
      mask.push(value);
   }

   outlet(0, mask);
}



