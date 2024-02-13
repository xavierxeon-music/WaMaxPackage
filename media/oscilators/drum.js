const canvas = document.querySelector('canvas#envelope_canvas');
const ctx = canvas.getContext("2d");

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

let values = {};

function update() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   let padding = 5;
   let fullLength = canvas.width - 2 * padding;
   let lengthScale = fullLength / 1000.0;

   let fullHeight = canvas.height - 2 * padding;
   let heightScale = fullHeight / 1.0;

   let drawCurve = function (heightKey, lengthKey, color) {

      let length = lengthKey in values ? values[lengthKey] : fullLength;
      let height = heightKey in values ? values[heightKey] / 100.0 : 0.0;

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
   drawCurve("noise_mix", "noise_length", "#00ff00");
   // drawCurve("filter_length", "source_length", "#0000ff");

}

max.bindInlet('init', init);
function init(dictName) {

   max.outlet("debug", dictName);
   let connect = function (name, minValue, maxValue, expo) {

      let slider = document.querySelector("input#" + name);
      slider.min = 0;
      slider.max = Math.pow(maxValue - minValue, 1.0 / expo);
      if (name in values)
         slider.value = Math.pow(values[name] - minValue, 1.0 / expo);
      else
         slider.value = 0.0;

      let output = document.querySelector("span#" + name);
      let setValue = function (value) {
         value = minValue + Math.pow(value, expo);
         output.innerHTML = Math.round(value);

         values[name] = value;

         max.setDict(dictName, values);
         max.outlet("bang");

         update();
      }

      slider.oninput = function () {
         setValue(this.value);
      }
      setValue(slider.value);
   }

   max.getDict(dictName, function (dict) {
      values = dict;

      connect("pitch_peak", 100.0, 1000.0, 2.0);
      connect("pitch_base", 50.0, 500.0, 2.0);
      connect("pitch_length", 10.0, 500.0, 2.0);
      connect("pitch_curve", -100.0, 100.0, 1.0);

      connect("source_mix", 0.0, 100.0, 2.0);
      connect("source_length", 10.0, 500.0, 2.0);
      connect("source_curve", -100.0, 100.0, 1.0);

      connect("noise_mix", 0.0, 100.0, 2.0);
      connect("noise_length", 10.0, 500.0, 2.0);
      connect("noise_curve", -100.0, 100.0, 1.0);

      connect("filter_freq", 300.0, 1300.0, 2.0);
      connect("filter_Q", 0.0, 100.0, 2.0);
      connect("filter_length", 10.0, 500.0, 2.0);
      connect("filter_curve", -100.0, 100.0, 1.0);
   });
}

// init

if (max.dummy != undefined)
   init("dummy");

update();
document.getElementById("defaultOpen").click();

