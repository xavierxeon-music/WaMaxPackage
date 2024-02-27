const maxAPI = require('max-api');
const os = require('os');
const https = require("https");

//  variables

const verbose = false;
const settings = require(os.homedir() + '/.hue_v2.json');

const basePath = '/clip/v2/resource';
const getOptions = {
   host: settings['bridge'],
   port: 443,
   method: 'GET',
   rejectUnauthorized: false,
   headers: {
      'hue-application-key': settings['username']
   }
};

const putOptions = {
   host: settings['bridge'],
   port: 443,
   method: 'PUT',
   rejectUnauthorized: false,
   headers: {
      'hue-application-key': settings['username'],
      'Content-Type': 'application/json'
   }
};
// functions

async function updateStatus(group, json) {

   await maxAPI.updateDict('hue_state', group, json['data']);
   await maxAPI.outlet("status", group);
}

async function status(group) {

   let groupGetOptions = Object.assign({}, getOptions);
   groupGetOptions.path = basePath + '/' + group;

   const statusRequest = https.request(groupGetOptions, (statusResponse) => {

      let data = [];
      statusResponse.on('data', (chunk) => {
         data.push(chunk);
      });

      statusResponse.on('end', () => {
         const json = JSON.parse(Buffer.concat(data).toString());
         updateStatus(group, json);
      });
   });

   statusRequest.on('error', (e) => {
      console.error(e);
   });
   statusRequest.end();
}

async function send(group, id, payload) {

   let groupSenndOptions = Object.assign({}, putOptions);
   groupSenndOptions.path = basePath + '/' + group + '/' + id;

   if (verbose)
      console.log('send', payload);

   const setRequest = https.request(groupSenndOptions, (sendResponse) => {

      let data = [];
      sendResponse.on('data', (chunk) => {
         data.push(chunk);
      });

      sendResponse.on('end', () => {
         const json = JSON.parse(Buffer.concat(data).toString());
         const errors = json['errors'];
         if (0 != errors.length)
            console.log(errors);
         else if (verbose)
            console.log("ok");
      });

   });

   setRequest.on('error', (e) => {
      console.error(e);
   });

   setRequest.write(payload);
   setRequest.end();
}


// handler & main 
maxAPI.addHandler('send', async (group, id, payload) => {

   await send(group, id, payload);
});

maxAPI.addHandler('status', async (group) => {

   await status(group);
});
