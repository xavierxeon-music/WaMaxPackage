// canvas

class Canvas extends BaseElement {

   constructor(parent, width, height) {

      super(parent, "canvas");
      debug("Canvas", parent, width, height, this.element);

      this.ctx = this.element.getContext("2d");

      if (!width)
         width = parent.style["width"];
      else
         width = width.toString() + "px";

      this.element.style["width"] = width;

      if (height)
         height = height.toString() + "px";

      this.element.style["height"] = height;
   }
}