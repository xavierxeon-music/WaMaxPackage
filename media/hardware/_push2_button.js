// push button

class PushButton extends BaseElement {

   static buttonMap = {};

   constructor(parent, id, x, y, halfSize) {

      super("button", parent);

      this.element.className = "pushbutton";
      this.isPad = false;

      PushButton.buttonMap[id] = this;
      this.id = id;

      if (halfSize)
         this.setStyle("height", "12px");

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
      max.outlet("midi", this.isPad ? "padClicked" : "buttonClicked", this.id, 1);
   }
   #released() {
      max.outlet("midi", this.isPad ? "padClicked" : "buttonClicked", this.id, 0);
   }
}

class PushPad extends PushButton {

   constructor(parent, id, x, y) {

      super(parent, id, x, y);

      this.element.className = "pushpad";
      this.isPad = true;
   }
}

max.bindInlet('setColor', setColor);
function setColor(name, hexColor) {

   let button = PushButton.buttonMap[name];
   button.setColor(hexColor);
}

