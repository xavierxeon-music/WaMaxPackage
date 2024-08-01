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

   clear() {
      this.ctx.clearRect(0, 0, this.element.width, this.element.height);
   }

   circle(x, y, radius, color, length, offset) {

      if (undefined == length)
         length = 1.0;
      if (undefined == offset)
         offset = 0;

      let startAngle = offset;
      let endAngle = offset + (length * 2 * Math.PI);

      this.ctx.fillStyle = color;

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, startAngle, endAngle);
      this.ctx.fill();
      this.ctx.closePath();
   }

   ring(x, y, radius, width, color, length, offset) {

      if (undefined == length)
         length = 1.0;
      if (undefined == offset)
         offset = 0;

      let startAngle = offset;
      let endAngle = offset + (length * 2 * Math.PI);

      this.ctx.strokeStyle = color;

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, startAngle, endAngle);
      this.ctx.lineWidth = width;
      this.ctx.stroke();
      this.ctx.closePath();
   }

}