autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "message");

outlets = 0;

//////////////////////////////////////////

// set up

var launchpad = new Global("Launchpad");

var padMumber = 0;
var padName = null;

//////////////////////////////////////////

function setPadNumber(value) {

   padNumber = value;
   resend();
}

function setName(name) {

   if ("bang" == name)
      return;

   padName = name;
   resend();
}

function resend() {

   if (0 == padNumber || null == padName)
      return;

   launchpad.nameMap[padNumber] = padName;
}
