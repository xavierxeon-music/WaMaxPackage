autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 3;
setoutletassist(0, "volume");
setoutletassist(1, "unmute");
setoutletassist(2, "unsolo");


include("_mixer.js");

var isMute = false;
var isSolo = false;
var patcherName = null;

function mixerHandle(idList, unmute) {

   if (unmute) {

      isMute = false;
      outlet(1, 0);
   }


   isSolo = false;
   for (var index = 0; index < idList.length; index++) {
      if (idList[index] == patcherName) {
         isSolo = true;
         break;
      }
   }
   if (!isSolo)
      outlet(2, 0);

   updateOutlet();
}
mixerHandle.local = 1;

function setup() {

   patcherName = patcher.name + "_" + jsarguments[1];
   mixer.addHandle(mixerHandle);
}
setup.local = 1;

function updateOutlet() {

   if (isMute) {

      outlet(0, 0);
      return;
   }

   if (mixer.hasSolo() && !isSolo) {
      outlet(0, 0);
      return;

   }

   outlet(0, 1);
}
updateOutlet.local = 0;

function loadbang() {
   setup();
}

function freebang() {
   mixer.removeHandle(mixerHandle);
}

function mute(value) {
   isMute = (1 == value);
   updateOutlet();
}

function solo(value) {

   if (1 == value)
      mixer.enableSolo(patcherName);
   else
      mixer.disableSolo(patcherName);
}
