// canvas

class Canvas extends BaseElement {

   constructor(parent, width, height) {

      super("canvas", parent);

      this.ctx = this.element.getContext("2d");

      if (!width)
         width = parent.element.style["width"];
      else
         width = width.toString() + "px";

      this.element.setAttribute("width", width);

      if (!height)
         height = parent.element.style["height"];
      else
         height = height.toString() + "px";

      this.element.setAttribute("height", height);

   }
}