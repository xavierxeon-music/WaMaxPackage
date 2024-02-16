const canvas = document.querySelector('canvas#envelope_canvas');
const ctx = canvas.getContext("2d");

let valueDict = {}; // the main dictionary
dictName = undefined;

let connectionMap = {};
let graphCategories = {};
const minLength = 10;
const maxLength = 500;

class Connection {

   constructor(key, minValue, maxValue, expo) {

      this.key = key;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.expo = expo;

      connectionMap[key] = this;

      this.slider = document.querySelector("input#" + key);
      this.slider.min = 0.0;
      this.slider.max = Math.pow(maxValue - minValue, 1.0 / expo);
      if (key in valueDict)
         this.slider.value = Math.pow(valueDict[key] - minValue, 1.0 / expo);
      else
         this.slider.value = 0.0;

      this.output = document.querySelector("span#" + key);

      // arrow function do not have their own context
      this.slider.oninput = () => {
         this.applySliderValue();
      }

      this.applySliderValue();
   }

   setSliderValue(value) {

      this.slider.value = Math.pow(value - this.minValue, 1.0 / this.expo);

      // apply to output
      this.output.innerHTML = Math.round(value);
   }

   applySliderValue() {

      let value = this.slider.value;
      value = this.minValue + Math.pow(value, this.expo);
      this.output.innerHTML = Math.round(value);

      valueDict[this.key] = value;

      if (dictName) {
         max.setDict(dictName, valueDict);
         max.outlet("bang");
      }

      updateGraphs();
   }
}

function updateGraphs() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   let padding = 5;
   let fullLength = canvas.width - 2 * padding;
   let lengthScale = fullLength / (maxLength - minLength);

   let fullHeight = canvas.height - 2 * padding;
   let heightScale = fullHeight / 1.0;

   let drawCurve = function (startHeight, endHeight, length, curve, color) {

      length = (length - minLength) * lengthScale;
      startHeight = (1.0 - startHeight) * heightScale;
      endHeight = (1.0 - endHeight) * heightScale;

      let midScale = (curve + 100.0) / 200.0;
      let midX = 0 + midScale * length;
      let midY = endHeight + midScale * (startHeight - endHeight)

      ctx.beginPath();
      ctx.moveTo(padding, padding + startHeight);
      ctx.lineTo(midX, midY);
      ctx.lineTo(padding + length, padding + endHeight);
      ctx.lineWidth = 5;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
   }

   let soundCategory = graphCategories["sound"];
   if (soundCategory) {
      let startHeight = 1.0;
      let endHeight = 0.0;
      drawCurve(startHeight, endHeight, valueDict["source_length"], valueDict["source_curve"], soundCategory[2]);
   }

   let pitchCategory = graphCategories["pitch"];
   if (pitchCategory) {
      let scale = 1.0 / (pitchCategory[1] - pitchCategory[0]);
      let startHeight = valueDict["pitch_start"] * scale;
      let endHeight = valueDict["pitch_end"] * scale;
      drawCurve(startHeight, endHeight, valueDict["pitch_length"], valueDict["pitch_curve"], pitchCategory[2]);
   }

   let noiseCategory = graphCategories["noise"];
   if (noiseCategory) {
      let scale = 1.0 / (noiseCategory[1] - noiseCategory[0]);
      let startHeight = valueDict["noise_start"] * scale;
      let endHeight = valueDict["noise_end"] * scale;
      drawCurve(startHeight, endHeight, valueDict["noise_length"], valueDict["noise_curve"], noiseCategory[2]);
   }

   let filterCategory = graphCategories["filter"];
   if (filterCategory) {
      let scale = 1.0 / (filterCategory[1] - filterCategory[0]);
      let startHeight = valueDict["filter_start"] * scale;
      let endHeight = valueDict["filter_end"] * scale;
      drawCurve(startHeight, endHeight, valueDict["filter_length"], valueDict["filter_curve"], filterCategory[2]);
   }

   let qCategory = graphCategories["q"];
   if (qCategory) {
      let scale = 1.0 / (qCategory[1] - qCategory[0]);
      let startHeight = valueDict["q_start"] * scale;
      let endHeight = valueDict["q_end"] * scale;
      drawCurve(startHeight, endHeight, valueDict["q_length"], valueDict["q_curve"], qCategory[2]);
   }

}

max.bindInlet('load', load);
function load(maxDictName) {

   dictName = maxDictName;

   max.getDict(dictName, function (maxDict) {

      for (let key in maxDict) {
         let value = maxDict[key];
         valueDict[key] = value;

         let connection = connectionMap[key];
         connection.setSliderValue(value);
      }

      if (0 == Object.keys(maxDict).length) {
         max.setDict(dictName, valueDict);
         max.outlet("bang");
      }

      updateGraphs();
   });
}

function init() {

   const request = new XMLHttpRequest();
   request.open('GET', './drum_defaults.json', false);
   request.send(null);
   valueDict = JSON.parse(request.responseText);

   const sm = new Connection("source_mix", 0.0, 100.0, 2.0);
   const sl = new Connection("source_length", minLength, maxLength, 2.0);
   const sc = new Connection("source_curve", -100.0, 100.0, 1.0);
   graphCategories["sound"] = [0.0, 100.0, "#ff0000"];

   const ps = new Connection("pitch_start", 100.0, 1000.0, 2.0);
   const pe = new Connection("pitch_end", 50.0, 500.0, 2.0);
   const pl = new Connection("pitch_length", minLength, maxLength, 2.0);
   const pc = new Connection("pitch_curve", -100.0, 100.0, 1.0);
   graphCategories["pitch"] = [50.0, 1000.0, "#0000ff"];

   const ns = new Connection("noise_start", 0.0, 100.0, 2.0);
   const ne = new Connection("noise_end", 0.0, 100.0, 2.0);
   const nl = new Connection("noise_length", minLength, maxLength, 2.0);
   const nc = new Connection("noise_curve", -100.0, 100.0, 1.0);
   graphCategories["noise"] = [0.0, 100.0, "#00ff00"];

   const fs = new Connection("filter_start", 300.0, 3000.0, 2.0);
   const fe = new Connection("filter_end", 300.0, 3000.0, 2.0);
   const fl = new Connection("filter_length", minLength, maxLength, 2.0);
   const fc = new Connection("filter_curve", -100.0, 100.0, 1.0);
   graphCategories["filter"] = [300.0, 3000.0, "#ffff00"];

   const qs = new Connection("q_start", 0.0, 100.0, 2.0);
   const qe = new Connection("q_end", 0.0, 100.0, 2.0);
   const ql = new Connection("q_length", minLength, maxLength, 2.0);
   const qc = new Connection("q_curve", -100.0, 100.0, 1.0);
   graphCategories["q"] = [0.0, 100.0, "#00ffff"];
}

