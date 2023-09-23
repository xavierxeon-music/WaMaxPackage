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

   maxAPI.post("LAUNCH PRE", program, appArgs);
   var process = spawn(program, appArgs);

   process.stdout.on('data', (data) => {
      maxAPI.post(`stdout: ${data}`);
   });

   process.stderr.on('data', (data) => {
      maxAPI.post(`stderr: ${data}`);
   });

   process.on('error', (err) => {
      maxAPI.post('Failed to start subprocess.');
   });

   maxAPI.post("LAUNCH POST", program, appArgs);
});

maxAPI.addHandler("python", (...args) => {

   var appArgs = ["-u"]
   for (const item of args)
      appArgs.push(item);

   //maxAPI.post("PYTHON PRE", appArgs);
   var process = spawn("/opt/homebrew/bin/python3", appArgs);

   process.stdout.on('data', (data) => {
      maxAPI.post(`PYHON stdout: ${data}`);
   });

   process.stderr.on('data', (data) => {
      maxAPI.post(`PYHON stderr: ${data}`);
   });

   process.on('error', (err) => {
      maxAPI.post('Failed to python.');
   });

   // maxAPI.post("PYHON POST", appArgs);
});