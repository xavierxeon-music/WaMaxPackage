// https://docs.cycling74.com/max8/vignettes/jwebcommunication

class MaxDummy {

   constructor() {
      this.dummy = true;
   }

   bindInlet(name, functionName) { }

   outlet(message, args) {
      let text = "";
      for (let i = 1; i < arguments.length; i++) {
         text += " " + arguments[i];
      }
      console.log(message, text);
   }

   getDict(name, functionName) {
      let localDict = {};
      functionName(localDict);
   }
   setDict(name, value) { }
}

if (window.max == undefined)
   window.max = new MaxDummy();