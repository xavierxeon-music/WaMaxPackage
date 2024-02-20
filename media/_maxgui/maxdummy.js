// https://docs.cycling74.com/max8/vignettes/jwebcommunication


// debugging
class MaxDummy {

   constructor() {
      this.dummy = true;

      this.ineltMap = {};
      this.dictMap = {};

      console.log("DUMMY METHODS");
      console.log("execInlet(name, ...args)");
      console.log("assocDict(name, fileName)");

      const pathname = location.pathname;
      const workingDirectory = pathname.substring(0, (pathname.lastIndexOf("/") || 1));
      console.log("@", workingDirectory);
   }

   bindInlet(name, functionPointer) {
      this.ineltMap[name] = functionPointer;
      console.log("DUMMY INLET", name);
   }

   outlet(id, ...args) {
      console.log("DUMMY OUTLET:", id, ...args);
   }

   getDict(name, functionPointer) {


      async function loadJson(fileName) {
         let response = await fetch(fileName);
         let text = await response.text();
         let remoteDict = JSON.parse(text);
         console.log("LOADED DICTIONARY", name);
         console.log(text);
         functionPointer(remoteDict);
      }

      let fileName = this.dictMap[name];
      if (fileName) {
         loadJson(fileName);
      }
      else {
         let localDict = {};
         functionPointer(localDict);
      }
   }

   setDict(name, value) {
      let fileName = this.dictMap[name];
      if (fileName) {

      }
   }

}

function execInlet(name, ...args) {

   if (window.max.dummy == undefined)
      return;

   let func = window.max.ineltMap[name];
   if (func)
      func(...args);
   else
      console.log("unable to find function", name);
}

function assocDict(name, fileName) {

   if (window.max.dummy == undefined)
      return;

   window.max.dictMap[name] = fileName;
   console.log("DUMMY DICTIONARY", name, "@", fileName);
}

if (window.max == undefined)
   window.max = new MaxDummy();

function debug(...args) {

   if (window.max.dummy != undefined) {
      console.log("DEBUG:", ...args);
   }
   else {
      max.outlet("DEBUG", args);
   }
}

// html style bindings
max.bindInlet('bodyStyle', bodyStyle);
function bodyStyle(name, value) {
   document.body.style[name] = value;
}

