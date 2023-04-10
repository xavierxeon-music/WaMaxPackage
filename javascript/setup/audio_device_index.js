autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "bang");

outlets = 3;
setoutletassist(0, "input_id");
setoutletassist(1, "output_id");
setoutletassist(2, "start");

var audioDeviceDict = new Dict("audio_devices");

function bang() {

   var deviceName = audioDeviceDict.get("name");
   var useSystemDevice = (1 === audioDeviceDict.get("use_system"));
   if (useSystemDevice)
      deviceName = audioDeviceDict.get("system_device");

   var inputId = 0;
   if (1 === audioDeviceDict.get("input_enabled"))
      inputId = audioDeviceDict.get("input::" + deviceName);

   var outputId = audioDeviceDict.get("output::" + deviceName);

   if (null === inputId || null === outputId)
      return;

   outlet(0, inputId);
   outlet(1, outputId);

   //post("AUDIO for ", deviceName, ": in = ", inputId, ", out = ", outputId, "is system = ", useSystemDevice, "\n");

   var start = audioDeviceDict.get("auto_start");
   outlet(2, start);
}

