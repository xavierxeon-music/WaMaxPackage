autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "id");

var graphics = new Global("graphics");
const id = "id_" + Math.random().toString(8).slice(2)

function loadbang() {

   graphics.target[id] = {};
   graphics.target[id]["type"] = jsarguments[1];

   outlet(0, id);
}

function toDict(content) {

   const componets = content.split(" ");
   const key = componets[0];
   const value = componets.slice(1).join();

   graphics.target[id][key] = value;
}

function bang() {

   outlet(0, id);
}

function notifydeleted() {

   delete graphics.target[id];
}