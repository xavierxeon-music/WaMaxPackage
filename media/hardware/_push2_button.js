// push button


class PushButton extends BaseElement {

   static buttonMap = {};

   constructor(parent, id, x, y) {

      super("button", parent);

      this.element.className = "pushbutton";
      this.isPad = false;

      PushButton.buttonMap[id] = this;
      this.id = id;

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
      max.outlet("button", "clicked", this.id);
   }
   #released() {
      max.outlet("button", "released", this.id);
   }
}

class PushPad extends PushButton {

   constructor(parent, id, x, y) {

      super(parent, id, x, y);

      this.element.className = "pushpad";
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
   }

   #clicked() {
      max.outlet("pad", "clicked", this.id);
   }
   #released() {
      max.outlet("pad", "released", this.id);
   }
}

max.bindInlet('setColor', setColor);
function setColor(name, hexColor) {

   let button = PushButton.buttonMap[name];
   button.setColor(hexColor);
}

