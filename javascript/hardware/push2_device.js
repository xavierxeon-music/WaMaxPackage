autowatch = 1;

// see https://github.com/Ableton/push-interface/blob/master/doc/AbletonPush2MIDIDisplayInterface.asc

// inlets and outlets
inlets = 1;
setinletassist(0, "lookup");

outlets = 1;
setoutletassist(0, "id");

var data = readJsonFile("push2_data.json");
var encoderIdList = [14, 15, 71, 72, 73, 74, 75, 76, 77, 78, 79];

var colorList = undefined;
var colorIndexBuffer = {};
var colorWhiteIndex = 0;

var whiteList = undefined;
var whiteIndexBuffer = {};

function loadbang() {
   init();
}

// midi routing
function midiPad(id, value) {

   if (0 == value)
      messnamed("push2_pad_released", [id, value]);
   else
      messnamed("push2_pad_pressed", [id, value]);
}

function midiButton(id, value) {

   var isEncoder = (encoderIdList.indexOf(id) > -1);
   if (isEncoder) {
      if (1 == value)
         messnamed("push2_encoder_down", id);
      else
         messnamed("push2_encoder_up", id);
   }
   else {
      if (0 == value)
         messnamed("push2_button_released", id);
      else
         messnamed("push2_button_pressed", id);
   }
}

function midiSlider(value) {

   messnamed("push2_slider_value", value);
}

function padClicked(name, clicked) {

   var id = 36; // fallback to pad on bottom left   

   var padmap = data["pads"];
   if (name in padmap)
      id = padmap[name];

   if (clicked)
      midiPad(id, 127);
   else
      midiPad(id, 0);

}

function buttonClicked(name, clicked) {

   var id = 85; // fallback to play button on bottom left   

   var buttonmap = data["buttons"];
   if (name in buttonmap)
      id = buttonmap[name][0];

   if (clicked)
      midiButton(id, 127);
   else
      midiButton(id, 0);
}

// name conversion
function push2Pad(id) {

   var padmap = data["pads"];
   for (var key in padmap) {
      const value = padmap[key];
      if (id === value) {
         outlet(0, ["pad", key]);
         return;
      }
   }
}

function pad2Push(name) {

   var id = 36; // fallback to pad on bottom left   

   var padmap = data["pads"];
   if (name in padmap)
      id = padmap[name];

   outlet(0, id);
}

function push2Button(id) {

   var buttonmap = data["buttons"];
   for (var name in buttonmap) {
      const value = buttonmap[name][0];
      const isColor = (1 == buttonmap[name][1]);
      if (value === id) {
         if (isColor)
            outlet(0, ["color_button", name]);
         else
            outlet(0, ["button", name]);
         return;
      }
   }
}

function button2Push(name) {

   var id = 85; // fallback to play button on bottom left   
   var isColor = true;

   var buttonmap = data["buttons"];
   if (name in buttonmap) {
      id = buttonmap[name][0];
      isColor = (1 == buttonmap[name][1]);
   }

   outlet(0, [id, isColor]);
}

// color functions
function padColor(isColor, id, inColor) {

   var color_index = colorSelect(isColor, inColor);
   outlet(0, ["pad", id, color_index]);
}

function padDummyColor(isColor, id, inColor) {

   var color_index = colorSelect(isColor, inColor);
   var newColor = colorList[color_index];

   var padmap = data["pads"];
   for (var key in padmap) {
      const value = padmap[key];
      if (id === value) {
         outlet(0, ["setColor", key, newColor]);
         return;
      }
   }
}

function buttonColor(isColor, id, inColor) {

   var color_index = colorSelect(isColor, inColor);
   outlet(0, ["button", id, color_index]);
}

function buttonDummyColor(isColor, id, inColor) {

   var color_index = colorSelect(isColor, inColor);
   var newColor = colorList[color_index];

   var buttonmap = data["buttons"];
   for (var name in buttonmap) {
      const value = buttonmap[name][0];
      if (value === id) {
         outlet(0, ["setColor", name, newColor]);
         return;
      }
   }

}

colorSelect.local = 1;
function colorSelect(isColor, inColor) {

   var color = new Color(inColor);
   var color_index = (1 === isColor) ? findNearestMatchInColorList(color) : findNearestMatchInWhiteList(color);

   return color_index;
}


findNearestMatchInColorList.local = 1;
function findNearestMatchInColorList(color) {

   if (colorList === undefined) // need colorList to work with
      init();

   if (color.hex in colorIndexBuffer)
      return colorIndexBuffer[color.hex];

   var color_index = colorWhiteIndex;
   var minDistance = 0;
   for (var index = 0; index < colorList.length; index++) {

      const test = colorList[index];
      const rgb = new Color(test);

      const distance = color.distance(rgb);

      if (0 === index || distance < minDistance) {
         minDistance = distance;
         color_index = index;
      }
   }

   //post("MATCH", color , color_index, "\n");

   colorIndexBuffer[color.hex] = color_index;
   return color_index;
}

findNearestMatchInWhiteList.local = 1;
function findNearestMatchInWhiteList(color) {

   if (whiteList === undefined) // need whiteList to work with
      init();

   if (color.hex in whiteIndexBuffer)
      return whiteIndexBuffer[color.hex];

   const luma = color.luma();

   var white__index = 127;
   for (var index = 1; index < whiteList.length; index++) {
      const last = whiteList[index - 1];
      const current = whiteList[index];
      if (luma > last && luma <= current) {
         white__index = index;
         break;
      }
   }

   //post(color, luma,  white__index, "\n");
   whiteIndexBuffer[color.hex] = white__index;
   return white__index;
}

// internal
init.local = 1;
function init() {

   colorList = data["colors"];
   whiteList = data["whites"];

   var white = new Color("ffffff");
   colorWhiteIndex = findNearestMatchInColorList(white);
   colorIndexBuffer[white.hex] = colorWhiteIndex;

   for (var index = 0; index < colorList.length; index += 1) {

      var color = colorList[index];
      colorIndexBuffer[color] = index;
   }

   whiteIndexBuffer["000000"] = 0;
   whiteIndexBuffer["ffffff"] = 127;
}


