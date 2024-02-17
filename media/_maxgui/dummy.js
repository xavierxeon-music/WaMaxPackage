// https://docs.cycling74.com/max8/vignettes/jwebcommunication


// debugging
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
max.bindInlet('bodyStyle', bodyStyle);
function bodyStyle(name, value) {
   document.body.style[name] = value;
}
