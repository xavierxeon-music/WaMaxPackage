const spawn = require('child_process').spawn;
const maxAPI = require('max-api');
const path = require('path');

maxAPI.addHandler("packagePath", () => {

   var packagePath = path.resolve(path.dirname(__filename) + "/../../");
   maxAPI.outlet(["packagePath", packagePath]);
});


function executeProgram(program, appArgs) {

   var process = spawn(program, appArgs);

   process.stdout.on('data', (data) => {
      // maxAPI.post(`stdout: ${data}`);
      maxAPI.outlet(["stdout", data]);
   });

   process.stderr.on('data', (data) => {
      maxAPI.post(`stderr: ${data}`);
      maxAPI.outlet(["stderr", data]);
   });

   process.on('error', (err) => {
      maxAPI.post('Failed to start subprocess.');
   });
}

maxAPI.addHandler("launch", (program, ...args) => {

   var appArgs = []
   for (const item of args)
      appArgs.push(item);

   executeProgram(program, appArgs);
});

maxAPI.addHandler("python", (...args) => {

   var appArgs = ["-u"]
   for (const item of args)
      appArgs.push(item);

   executeProgram("/opt/homebrew/bin/python3", appArgs);
});