function LCDDevice(deviceName) {

   this.internal = new Global("lcd");
   if (!this.internal.screen)
      this.internal.screen = {};

   this.deviceName = deviceName;

   return this;
}

LCDDevice.prototype.setScreen = function (screen) {

   this.internal.screen[this.deviceName] = screen;
}

LCDDevice.prototype.renderCommands = function () {

   var commandList = [];
   var screen = this.internal.screen[this.deviceName];
   if (!screen)
      return commandList;

   commandList.push(["dim", screen.width, screen.height]);
   commandList.push(["brgb", screen.bgColor.red, screen.bgColor.green, screen.bgColor.blue]);
   commandList.push(["clear"]);

   for (var index in screen.objectList) {
      var object = screen.objectList[index];

      var commands = object.renderCommands();
      if (Array.isArray(commands[0])) {
         for (var index2 in commands) {
            var command2 = commands[index2];
            commandList.push(command2);
         }
      }
      else {
         commandList.push(commands);
      }
   }

   return commandList;
}


//---------------------------------

function LCDScreen(width, height) {

   this.width = width;
   this.height = height;

   this.bgColor = new Color("black");
   this.objectList = [];

   return this;
}

LCDScreen.prototype.clear = function () {

   this.objectList.clear();
}

LCDScreen.prototype.addObject = function (object) {

   this.objectList.push(object);
}

LCDScreen.prototype.removeObject = function (object) {

   removeFromArray(this.objectList, callback);
}

LCDScreen.prototype.setBgColor = function (hexColor) {

   this.bgColor = new Color(hexColor);
}


//---------------------------------

function LCDBox(x, y, width, height, hexColor, fill) {

   this.x = x;
   this.y = y;
   this.width = width;
   this.height = height;

   this.color = new Color(hexColor);
   if (!fill)
      fill = true;
   this.fill = fill;

   return this;
}

LCDBox.prototype.setColor = function (hexColor) {

   this.color = new Color(hexColor);
}

LCDBox.prototype.renderCommands = function () {

   var commandList = [];
   commandList.push(["frgb", this.color.red, this.color.green, this.color.blue]);

   if (this.fill)
      commandList.push(["paintrect", this.x, this.y, this.x + this.width, this.y + this.height]);
   else
      commandList.push(["framerect", this.x, this.y, this.x + this.width, this.y + this.height]);

   return commandList;
}
