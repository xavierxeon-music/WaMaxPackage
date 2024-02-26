const maxAPI = require('max-api');
const os = require('os');
const https = require("https");

//  variables

const settings = require(os.homedir() + '/.hue_v2.json');

const basePath = '/clip/v2/resource';
const statusOptions = {
   host: settings['bridge'],
   port: 443,
   path: basePath + '/light',
   method: 'GET',
   rejectUnauthorized: false,
   headers: {
      'hue-application-key': settings['username']
   }
};

const sendLightOptions = {
   host: settings['bridge'],
   port: 443,
   path: basePath + '/light',
   method: 'PUT',
   rejectUnauthorized: false,
   headers: {
      'hue-application-key': settings['username'],
      'Content-Type': 'application/json'
   }
};
// functions

async function updateStatus(json) {

   await maxAPI.setDict('hue_state', json);
   await maxAPI.outlet("state", 1);
}

async function requestStatus() {

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

async function send(id, payload) {

   sendLightOptions.path = basePath + '/light/' + id;
   const setLightRequest = https.request(sendLightOptions, (setLightResponse) => {

      let data = [];
      setLightResponse.on('data', (chunk) => {
         data.push(chunk);
      });

      setLightResponse.on('end', () => {
         const text = Buffer.concat(data).toString();
         // console.log(text);
      });

   });

   setLightRequest.on('error', (e) => {
      console.error(e);
   });

   setLightRequest.write(payload);
   setLightRequest.end();

   // console.log(payload);
}


// handler & main 

maxAPI.addHandler("send", async (id, payload) => {

   await send(id, payload);
});

setInterval(requestStatus, 5000);


