// ui helpers

function Canvas(self, width, height) {

   this.self = self;
   this.width = width;
   this.height = height;

   return this;
}

Canvas.prototype.enforceAscpectRatio = function () {

   var rect = this.self.box.rect;
   var width = rect[2] - rect[1];
   var height = rect[3] - rect[0];
   var aspectRatio = width / height;

   var myAspectRatio = this.width / this.height;

   if (myAspectRatio == aspectRatio)
      return false;

   if (myAspectRatio > aspectRatio) {// scale width
      width = height * myAspectRatio;
   }
   else {// scale height
      height = width / myAspectRatio;
   }

   this.self.box.rect = [rect[0], rect[1], rect[0] + width, rect[1] + height];
   return true;
}

Canvas.prototype.enforceSize = function () {

   var rect = this.self.box.rect;
   this.self.box.rect = [rect[0], rect[1], rect[0] + this.width, rect[1] + this.height];
}

Canvas.prototype.screenToCanvas = function (xScreen, yScreen) {

   var rect = this.self.box.rect;
   var width = rect[2] - rect[1];
   var height = rect[3] - rect[0];

   var x = Math.round((this.width / width) * xScreen);
   var y = Math.round((this.height / height) * yScreen);

   return [x, y];
}

Canvas.prototype.canvasToScreen = function (xCanvas, yCanvas) {

   var rect = this.self.box.rect;
   var width = rect[2] - rect[1];
   var height = rect[3] - rect[0];

   var xScreen = Math.round((width / this.width) * xCanvas);
   var yScreen = Math.round((height / this.height) * yCanvas);

   return [xScreen, yScreen];
}

Canvas.prototype.canvasToSketchDimension = function (sketch, canvasWidth, canvasHeight) {

   var rect = this.self.box.rect;
   var width = rect[2] - rect[1];
   var height = rect[3] - rect[0];

   var testMin = sketch.screentoworld(0, 0, 0);
   var testMax = sketch.screentoworld(width, height, 0);
   var screenWorldWidth = testMax[0] - testMin[0];
   var screenWorldHeight = testMin[1] - testMax[1];

   var canvasWorldWidth = (screenWorldWidth / this.width) * canvasWidth;
   var canvasWorldHeight = (screenWorldHeight / this.height) * canvasHeight;

   return [canvasWorldWidth, canvasWorldHeight];
}

Canvas.setSize = function (self, width, height) {

   var rect = self.box.rect;
   self.box.rect = [rect[0], rect[1], rect[0] + width, rect[1] + height];
}