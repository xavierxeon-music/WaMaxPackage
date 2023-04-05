// ui helpers

function Canvas(self, width, height) {

   this.self = self;
   this.width = width;
   this.height = height;

   return this;
}

/*
Canvas.prototype.enforceAscpectRatio = function () {

   var rect = this.self.box.rect;
   var bwidth = rect[2] - rect[0];
   var bheight = rect[3] - rect[1];
   var aspectRatio = bwidth / bheight;

   var myAspectRatio = this.width / this.height;

   if (myAspectRatio == aspectRatio)
      return false;

   if (myAspectRatio > aspectRatio) {// scale width
      bwidth = bheight * myAspectRatio;
   }
   else {// scale height
      bheight = bwidth / myAspectRatio;
   }

   this.self.box.rect = [rect[0], rect[1], rect[0] + bwidth, rect[1] + bheight];
   return true;
}

Canvas.prototype.enforceSize = function () {

   var rect = this.self.box.rect;
   this.self.box.rect = [rect[0], rect[1], rect[0] + this.width, rect[1] + this.height];
}
*/

Canvas.prototype.screenToCanvas = function (xScreen, yScreen) {

   var rect = this.self.box.rect;
   var bwidth = rect[2] - rect[0];
   var bheight = rect[3] - rect[1];

   var x = Math.round((this.width / bwidth) * xScreen);
   var y = Math.round((this.height / bheight) * yScreen);

   return [x, y];
}

Canvas.prototype.canvasToScreen = function (xCanvas, yCanvas) {

   var rect = this.self.box.rect;
   var bwidth = rect[2] - rect[0];
   var bheight = rect[3] - rect[1];

   var xScreen = Math.round((bwidth / this.width) * xCanvas);
   var yScreen = Math.round((bheight / this.height) * yCanvas);

   return [xScreen, yScreen];
}

Canvas.prototype.canvasSizeToWold = function (sketch, widthOnCanvas, heightOnCanvas) {

   var sizeOnScreen = this.canvasToScreen(widthOnCanvas, heightOnCanvas);
   var worldCubeSide = sketch.screentoworld((this.width / 2) + sizeOnScreen[0], (this.height / 2) - sizeOnScreen[1], 0);

   return [0.5 * worldCubeSide[0], 0.5 * worldCubeSide[1]];
}

