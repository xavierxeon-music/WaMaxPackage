const spawn = require('child_process').spawn;
const maxAPI = require('max-api');
const path = require('path');

maxAPI.addHandler("packagePath", () => {

   var packagePath = path.resolve(path.dirname(__filename) + "/../../");
   maxAPI.outlet(["packagePath", packagePath]);
});

maxAPI.addHandler("launch", (program, ...args) => {

   var appArgs = []
   for (const item of args)
      appArgs.push(item);

   spawn(program, appArgs);
});