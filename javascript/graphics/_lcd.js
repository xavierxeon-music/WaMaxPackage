//
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

   this.penSize = 1;

   this.setColor(hexColor, fill);

   return this;
}

LCDBox.prototype.setColor = function (hexColor, fill) {

   this.color = new Color(hexColor);

   if (undefined == fill)
      fill = true;
   this.fill = fill;
}

LCDBox.prototype.renderCommands = function () {

   var commandList = [];
   commandList.push(["frgb", this.color.red, this.color.green, this.color.blue]);
   commandList.push(["pensize", this.penSize, this.penSize]);

   if (this.fill)
      commandList.push(["paintrect", this.x, this.y, this.x + this.width, this.y + this.height]);
   else
      commandList.push(["framerect", this.x, this.y, this.x + this.width, this.y + this.height]);

   return commandList;
}

//---------------------------------

function LCDPie(x, y, width, height, hexColor, fill) {

   this.x = x;
   this.y = y;
   this.width = width;
   this.height = height;

   this.penSize = 1;

   this.startAngle = 0;
   this.arcLength = 360;

   this.setColor(hexColor, fill);

   return this;
}

LCDPie.prototype.setColor = function (hexColor, fill) {

   this.color = new Color(hexColor);

   if (undefined == fill)
      fill = true;

   this.fill = fill;
}

LCDPie.prototype.renderCommands = function () {

   var commandList = [];
   commandList.push(["frgb", this.color.red, this.color.green, this.color.blue]);
   commandList.push(["pensize", this.penSize, this.penSize]);

   if (this.fill)
      commandList.push(["paintarc", this.x, this.y, this.x + this.width, this.y + this.height, this.startAngle, this.arcLength]);
   else
      commandList.push(["framearc", this.x, this.y, this.x + this.width, this.y + this.height, this.startAngle, this.arcLength]);

   return commandList;
}

//---------------------------------

function LCDText(x, y, text, hexColor, fontSize) {

   this.x = x;
   this.y = y;

   this.setColor(hexColor);
   this.setText(text);

   return this;
}

LCDText.prototype.setColor = function (hexColor) {

   this.color = new Color(hexColor);
}

LCDText.prototype.setText = function (text, fontSize) {

   this.text = text;

   if (!fontSize)
      this.fontSize = 12;
   else
      this.fontSize = fontSize;
}

LCDText.prototype.renderCommands = function () {

   var commandList = [];
   commandList.push(["frgb", this.color.red, this.color.green, this.color.blue]);
   commandList.push(["moveto", this.x, this.y]);
   commandList.push(["font", "Arial", this.fontSize]);

   commandList.push(["write", this.text]);

   return commandList;
}
