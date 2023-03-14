autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "id");

var graphics = new Global("graphics");
var id = "id_" + Math.random().toString(8).slice(2)
var deviceName = "generic";
var myDict = undefined;

function toDict(content) {

   if (myDict === undefined)
      createMyDict();

   var componets = content.split(" ");
   var key = componets[0];
   var value = componets.slice(1).join();

   myDict[key] = value;
   //post("update", id, jsarguments[1], deviceName, key, value, "\n")
}

function setDeviceName(name) {

   var oldDeviceName = deviceName;
   deviceName = name;

   createMyDict();

   var oldDict = graphics.target[oldDeviceName][id];
   for (key in oldDict) {
      myDict[key] = oldDict[key];
   }

   delete graphics.target[oldDeviceName][id];
   //post("setDeviceName", deviceName, name, "\n");
}

function bang() {

   outlet(0, id);
}

function notifydeleted() {

   if (myDict !== undefined) {
      delete myDict;
   }
}

function createMyDict() {

   if (graphics.target === undefined) {
      graphics.target = {};
      //post("init target", "\n");
   }

   if (graphics.target[deviceName] === undefined)
      graphics.target[deviceName] = {};

   graphics.target[deviceName][id] = {};
   myDict = graphics.target[deviceName][id];

   myDict["type"] = jsarguments[1];
   //post("new target", id, jsarguments[1], deviceName, "\n")

}
createMyDict.local = 1;