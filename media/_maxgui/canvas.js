// canvas

class Canvas {

   constructor(parent, width, height) {

      this.element = document.createElement("canvas");
      parent.appendChild(this.element);

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