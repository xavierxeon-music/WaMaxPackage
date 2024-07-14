//

class PushEncoder extends BaseElement {

   constructor(parent, id, x, y) {

      super("div", parent);
      this.element.className = "pushencoder";
      this.move(x, y);

      this.id = id;

      this.element.innerHTML = "<svg width='18px' heigth='28px' style='stroke:#111111;'>\
         <path d='M 6,5 L 10,5'/>\
         <path d='M 8,3 L 8,7'/>\
         <path d='M 0,10 L 16,10'/>\
         <path d='M 6,15 L 10,15'/>\
         <path d='M 0,20 L 16,20'/>\
         </svg>";

      this.element.addEventListener("pointerdown", (clickEvent) => {
         let func = this.#getFunction(clickEvent.layerY);
         this.#clicked(func);
      });
      this.element.addEventListener("pointerup", (clickEvent) => {
         let func = this.#getFunction(clickEvent.layerY);
         this.#released(func);
      });
      this.element.addEventListener("pointercancel", (clickEvent) => {
         let func = this.#getFunction(clickEvent.layerY);
         this.#released(func);
      });

      this.element.addEventListener("pointermove", (hoverEvent) => {
         title.showMessage(this.id);
      });
      this.element.addEventListener("pointerleave", (hoverEvent) => {
         title.clearMessage();
      });
   }

   #getFunction(y) {
      if (y < 10)
         return 1; // plus
      else if (y > 20)
         return -1; // touch
      else
         return 127; // minus
   }

   #clicked(func) {
      if (func > 0)
         max.outlet("midi", "encoderClicked", this.id, func);
      else
         max.outlet("midi", "padClicked", this.id, 127);

   }
   #released(func) {
      if (func > 0)
         return;
      else
         max.outlet("midi", "padClicked", this.id, 0);
   }
}