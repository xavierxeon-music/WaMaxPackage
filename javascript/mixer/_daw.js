//

var daw = new Global("daw");

if (!daw.portDict)
   daw.portDict = {};

if (!daw.useCounter)
   daw.useCounter = 0;

daw.debug = function () {

   print("dict content:")
   for (var key in this.portDict) {
      var name = this.portDict[key];
      print("*", key, name);
   }
}

daw.register = function () {

   this.useCounter++;
   //print("reg", this.useCounter);
}

daw.deregister = function () {

   this.useCounter--;
   if (0 == this.useCounter)
      this.portDict = {};

   //print("de-reg", this.useCounter);
}

daw.addPortName = function (index, name, isSender) {

   if (!index || !name)
      return;

   var prefix = isSender ? "s" : "r";
   var key = prefix + index.toString();

   this.portDict[key] = name;

   //print("add", key, name);
   //this.debug();

   if (this.updateFunction)
      this.updateFunction();
}

daw.removePortName = function (index, isSender) {

   if (!index)
      return;

   var prefix = isSender ? "s" : "r";
   var key = prefix + index.toString();

   delete this.portDict[key];
   //print("remove", key);
   //this.debug();

   if (this.updateFunction)
      this.updateFunction();
}
