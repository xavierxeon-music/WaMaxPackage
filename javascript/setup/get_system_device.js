const maxApi = require('max-api');
const { execSync } = require('child_process');

function getSystemDeivce() {
   const command_mac = "system_profiler SPAudioDataType -json";
   const commandData = execSync(command_mac);
   const deviceMap = JSON.parse(commandData);

   const deviceList = deviceMap['SPAudioDataType'][0]['_items']

   // first pass - find system output device
   for (var i = 0; i < deviceList.length; i++) {
      const entry = deviceList[i];
      if ('coreaudio_default_audio_output_device' in entry) {
         const name = entry['_name']
         maxApi.outlet(name);
         return;
      }
   }

   // second pass - find system default device
   for (var i = 0; i < deviceList.length; i++) {
      const entry = deviceList[i];
      if ('coreaudio_default_audio_system_device' in entry) {
         const name = entry['_name']
         maxApi.outlet(name);
         return;
      }
   }
}

maxApi.addHandler('execute', () => { getSystemDeivce(); });
