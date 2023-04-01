// ui helpers

function Ui() {
   return this;
}

Ui.setSize = function (self, width, height) {

   var rect = self.box.rect;
   self.box.rect = [rect[0], rect[1], rect[0] + width, rect[1] + height];
}