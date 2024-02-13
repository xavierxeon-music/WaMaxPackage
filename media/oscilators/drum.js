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

let x = 100;
let y = 100;

let values = {};


max.bindInlet('doSomething', doSomething);
function doSomething(a, b) {
   max.outlet('foo', a, b);

   x = a;
   y = b;
   update();
}

function update() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ctx.beginPath();
   ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
   ctx.closePath();

   ctx.fillStyle = "#ff00ff";
   ctx.fill();
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
      connect("pitch_curve", -1.0, 1.0, 1.0);
   });
}

// init

if (max.dummy != undefined)
   init("dummy");

update();
document.getElementById("defaultOpen").click();

