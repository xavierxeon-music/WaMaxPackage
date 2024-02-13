// https://docs.cycling74.com/max8/vignettes/jwebcommunication

class MaxDummy {

   constructor() {
   }

   bindInlet(name, functionName) { }
   outlet(message, args) { }
   getDict(name, functionName) { }
   setDict(name, value) { }
}

if (window.max == undefined)
   window.max = new MaxDummy();