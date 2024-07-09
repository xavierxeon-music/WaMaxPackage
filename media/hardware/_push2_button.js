// push button


class PushButton extends BaseElement {

   static buttonMap = {};

   constructor(parent, id, x, y) {

      super("button", parent);
      this.element.className = "pushbutton";
      PushButton.buttonMap[id] = this;
      this.id = id;

      this.isPad = false;

      this.element.addEventListener("pointerdown", (clickEvent) => {
         this.#clicked();
      });
      this.element.addEventListener("pointerup", (clickEvent) => {
         this.#released();
      });
      this.element.addEventListener("pointercancel", (clickEvent) => {
         this.#released();
      });

      this.element.addEventListener("pointerenter", (hoverEvent) => {
         title.showMessage(this.id);
      });
      this.element.addEventListener("pointerleave", (hoverEvent) => {
         title.clearMessage();
      });

      this.move(x, y);
   }

   setColor(hexColor) {
      this.setStyle("background", "#" + hexColor);
   }

   #clicked() {
      max.outlet("mouse", "clicked", this.id, this.isPad);
   }
   #released() {
      max.outlet("mouse", "released", this.id, this.isPad);
   }
}

max.bindInlet('setColor', addMessage);
function addMessage(id, hexColor) {
   let button = PushButton.buttonMap[id];
   button.setColor(hexColor);
}
