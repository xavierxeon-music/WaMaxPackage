const maxAPI = require('max-api');
const os = require('os');
const https = require("https");

// vars

const settings = require(os.homedir() + '/.hue_v2.json');

const basePath = '/clip/v2/resource';
const requestOptions = {
   host: settings['bridge'],
   port: 443,
   path: basePath,
   method: 'GET',
   rejectUnauthorized: false,
   headers: {
      'hue-application-key': settings['username']
   }
};

let commandStack = {};

// functions

function updateStatus(json) {

   //console.log(json);
   maxAPI.outlet("status", 1);
}

function requestStatus() {

   const statusOptions = requestOptions;
   statusOptions.path = basePath + '/light';

   const statusRequest = https.request(statusOptions, (statusResponse) => {

      let data = [];
      statusResponse.on('data', (chunk) => {
         data.push(chunk);
      });

      statusResponse.on('end', () => {
         const json = JSON.parse(Buffer.concat(data).toString());
         updateStatus(json);
      });
   });

   statusRequest.on('error', (e) => {
      console.error(e);
   });
   statusRequest.end();
}

function processStack() {

}

const stausTimer = setInterval(requestStatus, 5000);
const stackTimer = setInterval(processStack, 100);

// handlers

maxAPI.addHandler("state", (deviceName, on) => {

   if (deviceName in commandStack)
      commandStack[deviceName]['on'] = { 'on': on };
});

