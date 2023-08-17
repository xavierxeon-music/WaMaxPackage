autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "list");

outlets = 1;
setoutletassist(0, "input");

//////////////////////////////////////////

// set up
var kraken = new Global("kraken");
kraken.numberMap = null;

//////////////////////////////////////////

function bang() {

   bang();
}

function bang() {

   kraken.numberMap = {};

   var deviceInfo = readJsonFile(jsarguments[1]);

   for (var deviceName in deviceInfo) {
      var device = deviceInfo[deviceName];
      for (var partName in device) {
         var part = device[partName];
         if ("number" == typeof part) {
            var number = part;
            kraken.numberMap[number] = [deviceName, partName, 0];

         }
         else if ("object" == typeof part) {
            for (var index in part) {
               var number = part[index];
               kraken.numberMap[number] = [deviceName, partName, parseInt(index)];
            }
         }
      }
   }
}

function list(value, number) {

   if (null == kraken.numberMap)
      return;

   var key = kraken.numberMap[number];
   if (undefined == key)
      return;

   var message = key.concat([value]);
   outlet(0, message);
}
