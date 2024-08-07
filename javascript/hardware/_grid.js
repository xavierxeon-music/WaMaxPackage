//

function GridDevice(isEncoder) {

   this.internal = new Global("Grid");

   if (isEncoder)
      this.receiverName = "grid_enc_request";

   return this;
}

GridDevice.prototype.setCallback = function (callback) {

   this.internal.callback = callback;
}

GridDevice.prototype.sendCallback = function (type, id, value) {

   if (!this.internal.callback)
      return;

   this.internal.callback(type, id, value);
}

GridDevice.prototype.setName = function (id, name) {

   if (!this.receiverName)
      return;

   messnamed(this.receiverName, "name", id, name);
}

GridDevice.prototype.setColor = function (id, hexColor) {

   if (!this.receiverName)
      return;

   messnamed(this.receiverName, "color", id, hexColor);
}

GridDevice.prototype.setNameAndColor = function (id, name, hexColor) {

   this.setName(id, name);
   this.setColor(id, hexColor);
}

