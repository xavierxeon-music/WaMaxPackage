// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 1;
setoutletassist(0, "id");

var target = new Dict("graphics_target");
var id = "id_" + Math.random().toString(8).slice(2)

function loadbang() {
   target.append(id);
   target.setparse(id, "type: circle");

   outlet(0, id);
}

function toDict(content) {
   var componets = content.split(" ");
   var key = componets[0];
   var value = componets.slice(1).join();

   target.set(id + "::" + key, value);
}

function bang() {
   outlet(0, id);
}

function notifydeleted() {
   target.remove(id);
}