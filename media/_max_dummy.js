function MaxDummy() {

   this.bindInlet = function (name, location) { }
   this.outlet = function () { }

   return this;
}

if (window.max == undefined)
   window.max = new MaxDummy();