autowatch = 1;

// inlets and outlets
inlets = 2;
setinletassist(0, "message");
setinletassist(1, "response");

outlets = 2;
setoutletassist(0, "state");
setoutletassist(1, "request");

var baseUrl;

function init(settingsFileName) {

   var settings = readJsonFile(settingsFileName)
   for (var key in settings) {
      value = settings[key];
      print(key, value);
   }


}

function state() {
   print('state');
}

function on() {
   print('on');
}

function off() {
   print('off');
}

function color(value) {
   print('color', value);
}

function colorbright(value) {
   print('colorbright', value);
}

function brightness(value) {
   print('brightness', value);
}

function dictionary(data) {

}
