autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "text");

outlets = 8;
setoutletassist(0, "stage1");
setoutletassist(1, "stage2");
setoutletassist(2, "stage3");
setoutletassist(3, "stage4");
setoutletassist(4, "stage5");
setoutletassist(5, "stage6");
setoutletassist(6, "stage7");
setoutletassist(7, "stage8");

// data types

// variables

var fileName = null;
var modificationDate = null;

var segmentCount = 0;
var segments = [];

var currentSegmentIndex = 0;
var currentSegmentTick = 0;

// functions


function bang() {
   post("bang");
}

function reset() {

   currentSegmentTick = 0;
   currentSegmentIndex = 0;
}

function moddate(value) {

   if (value != modificationDate) {
      modificationDate = value;
      loadInternal();
   }
}

function read(newFileName) {

   fileName = newFileName;

   if (null != modificationDate)
      loadInternal();
}

function loadInternal() {

   var data = readJsonFile(fileName);
   var project = data["project"];

   segmentCount = parseInt(project["segments"]);
   var defaultLength = parseInt(project["division"]);
}