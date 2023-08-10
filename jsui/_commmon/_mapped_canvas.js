// ui helpers

function MappedCanvas(self, width, height, background) {

   this.self = self;
   this.ctx = new MaxCanvas(self).getContext("max-2d");

   this.width = width;
   this.height = height;

   if (background !== undefined)
      this.clearColor = "#" + Color(background).hex;
   else
      this.clearColor = "#" + Color("white").hex;

   return this;
}

MappedCanvas.prototype.draw = function () {

   this.ctx.redraw();
}

MappedCanvas.prototype.setColor = function (color) {

   this.ctx.fillStyle = "#" + Color(color).hex;
}

MappedCanvas.prototype.clear = function () {

   this.ctx.clearRect(0, 0, this.width, this.height);

   this.ctx.fillStyle = this.clearColor;
   rect(0, 0, this.width, this.height);
}

MappedCanvas.prototype.drawRectangle = function (left, top, width, height, filled) {

   var pos = this.canvasToScreen(left, top);
   var dim = this.canvasToScreen(width, height);

   this.ctx.beginPath();
   if (filled)
      this.ctx.fillRect(pos[0], pos[1], dim[0], dim[1]);
   else
      this.ctx.strokeRect(pos[0], pos[1], dim[0], dim[1]);
   this.ctx.closePath();
}

MappedCanvas.prototype.getBoxDimensions = function () {

   var width = this.self.box.rect[2] - this.self.box.rect[0];
   var height = this.self.box.rect[3] - this.self.box.rect[1];

   return [width, height];
}

MappedCanvas.prototype.getAspectRatio = function () {

   var width = this.self.box.rect[2] - this.self.box.rect[0];
   var height = this.self.box.rect[3] - this.self.box.rect[1];

   return width / height;
}

MappedCanvas.prototype.screenToCanvas = function (xScreen, yScreen) {

   var boxDim = this.getBoxDimensions();
   var x = Math.round((this.width / boxDim[0]) * xScreen);
   var y = Math.round((this.height / boxDim[1]) * yScreen);

   return [x, y];
}

MappedCanvas.prototype.canvasToScreen = function (xCanvas, yCanvas) {

   var boxDim = this.getBoxDimensions();
   var xScreen = Math.round((boxDim[0] / this.width) * xCanvas);
   var yScreen = Math.round((boxDim[1] / this.height) * yCanvas);

   return [xScreen, yScreen];
}