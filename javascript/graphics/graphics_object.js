autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "id");

var target = new Dict("graphics_target");
const id = "id_" + Math.random().toString(8).slice(2)

function loadbang() {
   target.append(id);
   target.setparse(id, "type: " + jsarguments[1]);

   outlet(0, id);
}

function toDict(content) {
   const componets = content.split(" ");
   const key = componets[0];
   const value = componets.slice(1).join();

   target.set(id + "::" + key, value);
}

function bang() {
   outlet(0, id);
}

function notifydeleted() {
   target.remove(id);
}