// ui helpers

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

function Canvas(self, width, height) {

   this.self = self;
   this.width = width;
   this.height = height;

   this.color = Color("000000");

   return this;
}

Canvas.prototype.draw = function () {

   mgraphics.redraw();
}

Canvas.prototype.setColor = function (color) {

   this.color = Color(color);
}

Canvas.prototype.drawRectangle = function (left, top, width, height, filled) {

   mgraphics.set_source_rgba(this.color.red / 256.0, this.color.green / 256.0, this.color.blue / 256.0, 1);

   var pos = this.canvasToScreen(left, top);
   var dim = this.canvasToScreen(width, height);
   mgraphics.rectangle(pos[0], pos[1], dim[0], dim[1]);
   if (filled)
      mgraphics.fill();
   else
      mgraphics.stroke();
}

Canvas.prototype.getBoxDimensions = function () {

   var width = this.self.box.rect[2] - this.self.box.rect[0];
   var height = this.self.box.rect[3] - this.self.box.rect[1];

   return [width, height];
}

Canvas.prototype.getAspectRatio = function () {

   var width = this.self.box.rect[2] - this.self.box.rect[0];
   var height = this.self.box.rect[3] - this.self.box.rect[1];

   return width / height;
}

Canvas.prototype.screenToCanvas = function (xScreen, yScreen) {

   var boxDim = this.getBoxDimensions();
   var x = Math.round((this.width / boxDim[0]) * xScreen);
   var y = Math.round((this.height / boxDim[1]) * yScreen);

   return [x, y];
}

Canvas.prototype.canvasToScreen = function (xCanvas, yCanvas) {

   var boxDim = this.getBoxDimensions();
   var xScreen = Math.round((boxDim[0] / this.width) * xCanvas);
   var yScreen = Math.round((boxDim[1] / this.height) * yCanvas);

   return [xScreen, yScreen];
}