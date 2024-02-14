const canvas = document.querySelector('canvas#envelope_canvas');
const ctx = canvas.getContext("2d");

let valueDict = {}; // the main dictionary
dictName = undefined;

let connectionMap = {}

class Connection {

   constructor(key, minValue, maxValue, expo) {

      this.key = key;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.expo = expo;

      connectionMap[key] = this;
      valueDict[key] = minValue;

      this.slider = document.querySelector("input#" + key);
      this.slider.min = 0;
      this.slider.max = Math.pow(maxValue - minValue, 1.0 / expo);
      this.slider.value = 0.0;

      this.output = document.querySelector("span#" + key);

      // arrow function do not have their own context
      this.slider.oninput = () => {
         this.applySliderValue();
      }
   }

   readFromDict() {
      if (this.key in valueDict)
         slider.value = Math.pow(valueDict[this.key] - this.minValue, 1.0 / this.expo);

      applySliderValue();
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

      update();
   }
}

function showTab(evt, tabName) {

   // Get all elements with class="tabcontent" and hide them
   let tabcontent = document.getElementsByClassName("tabcontent");
   for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
   }

   // Get all elements with class="tablinks" and remove the class "active"
   let tablinks = document.getElementsByClassName("tablinks");
   for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
   }

   // Show the current tab, and add an "active" class to the button that opened the tab
   document.getElementById(tabName).style.display = "grid";
   evt.currentTarget.className += " active";
}


function update() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   let padding = 5;
   let fullLength = canvas.width - 2 * padding;
   let lengthScale = fullLength / 500.0;

   let fullHeight = canvas.height - 2 * padding;
   let heightScale = fullHeight / 1.0;

   let drawCurve = function (heightKey, lengthKey, color) {

      let length = lengthKey in valueDict ? valueDict[lengthKey] : fullLength;
      let height = heightKey in valueDict ? valueDict[heightKey] / 100.0 : 0.0;

      ctx.beginPath();
      ctx.moveTo(padding, padding + fullHeight);
      ctx.lineTo(padding, padding + ((1.0 - height) * heightScale));
      ctx.lineTo(padding + (length * lengthScale), padding + fullHeight);
      ctx.lineWidth = 5;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
   }

   drawCurve("source_mix", "source_length", "#ff0000");
   drawCurve("noise_start", "noise_length", "#00ff00");
   // drawCurve("filter_length", "source_length", "#0000ff");

}

max.bindInlet('init', init);
function init(maxDictName) {

   dictName = maxDictName;

   max.getDict(dictName, function (dict) {

      for (let key in dict) {
         valueDict[key] = dict[key];

         let connection = dict[key];
         connection.readFromDict();
      }
   });
}

// init

const sm = new Connection("source_mix", 0.0, 100.0, 2.0);
const sl = new Connection("source_length", 10.0, 500.0, 2.0);
const sc = new Connection("source_curve", -100.0, 100.0, 1.0);

const ps = new Connection("pitch_start", 100.0, 1000.0, 2.0);
const pe = new Connection("pitch_end", 50.0, 500.0, 2.0);
const pl = new Connection("pitch_length", 10.0, 500.0, 2.0);
const pc = new Connection("pitch_curve", -100.0, 100.0, 1.0);

const ns = new Connection("noise_start", 0.0, 100.0, 2.0);
const ne = new Connection("noise_end", 0.0, 100.0, 2.0);
const nl = new Connection("noise_length", 10.0, 500.0, 2.0);
const nc = new Connection("noise_curve", -100.0, 100.0, 1.0);

const fs = new Connection("filter_start", 300.0, 3000.0, 2.0);
const fe = new Connection("filter_end", 300.0, 3000.0, 2.0);
const fl = new Connection("filter_length", 10.0, 500.0, 2.0);
const fc = new Connection("filter_curve", -100.0, 100.0, 1.0);

const qs = new Connection("q_start", 0.0, 99.0, 2.0);
const qe = new Connection("q_end", 0.0, 99.0, 2.0);
const ql = new Connection("q_length", 10.0, 500.0, 2.0);
const qc = new Connection("q_curve", -100.0, 100.0, 1.0);

if (max.dummy != undefined)
   init("dummy");

update();
document.getElementById("defaultOpen").click();

