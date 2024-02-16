// https://docs.cycling74.com/max8/vignettes/jwebcommunication

class MaxDummy {

   constructor() {
      this.dummy = true;
   }

   bindInlet(name, functionName) { }

   outlet() {
      let text = "";
      for (let i = 0; i < arguments.length; i++) {
         if (i != 0)
            text += " ";
         text += arguments[i];
      }
      console.log("MAX OUTLET:", text);
   }

   getDict(name, functionName) {
      let localDict = {};
      functionName(localDict);
   }
   setDict(name, value) { }
}

if (window.max == undefined)
   window.max = new MaxDummy();

function debug() {
   let text = "";
   for (let i = 0; i < arguments.length; i++) {
      if (i != 0)
         text += " ";
      text += arguments[i];
   }

   if (window.max.dummy != undefined) {
      console.log("DEBUG:", text);
   }
   else {
      max.outlet("DEBUG", text);
   }
}

// html style bindings
max.bindInlet('bgColor', bgColor);
function bgColor(hexColor) {
   document.body.style.backgroundColor = "#" + hexColor;
}

max.bindInlet('margin', margin);
function margin(left, top) {
   document.body.style.marginLeft = left.toString() + "px";
   document.body.style.marginTop = top.toString() + "px";
}

// tabs
function showTab(evt, tabName) {

   // hide all tabs
   let tabcontent = document.getElementsByClassName("tabcontent");
   for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
   }

   // deactivae all tab buttons
   let tabbutton = document.getElementsByClassName("tabbutton");
   for (let i = 0; i < tabbutton.length; i++) {
      tabbutton[i].className = tabbutton[i].className.replace(" active", "");
   }

   // show current tab and active corresponfing button
   document.getElementById(tabName).style.display = "grid";
   evt.currentTarget.className += " active";
}