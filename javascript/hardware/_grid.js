//

function GridDevice(isEncoder) {

   this.internal = new Global("Grid");
   if (!this.internal.callbackList)
      this.internal.callbackList = [];

   if (isEncoder)
      this.receiverName = "grid_enc_request";

   return this;
}

GridDevice.prototype.addCallback = function (callback) {

   this.internal.callbackList.push(callback);
}

GridDevice.prototype.removeCallback = function (callback) {

   removeFromArray(this.internal.callbackList, callback);
}

GridDevice.prototype.sendCallback = function (type, id, value) {

   for (var index in this.internal.callbackList) {
      var callback = this.internal.callbackList[index];
      callback(type, id, value);
   }
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

