//


let buttonMap = {};

class PushButton extends BaseElement {

   constructor(parent, id, x, y) {

      super("button", parent);
      this.element.className = "pushbutton";
      buttonMap[id] = this;
      this.id = id;

      this.callbackFunction = undefined;
      this.element.addEventListener("click", (clickEvent) => {
         this.#clicked();
      });

      this.move(x, y);
   }

   setColor(hexColor) {
      this.setStyle("background", "#" + hexColor);
   }

   #clicked() {

      if (!this.callbackFunction)
         return;

      this.callbackFunction();

   }
}

max.bindInlet('setColor', addMessage);
function addMessage(id, hexColor) {
   let button = buttonMap[id];
   button.setColor(hexColor);

}


// gui
setupDocument(250, 1, 1);
let title = new Title("Push 2");
let main = new Div(document.body);
main.setStyle("background", "#aaaaaa");
main.forceHeigth("300px");

for (let x = 0; x < 8; x++) {
   new PushButton(main, "t" + parseInt(x + 1), 30 + x * 20, 50);
   new PushButton(main, "b" + parseInt(x + 1), 30 + x * 20, 110);
   for (let y = 0; y < 8; y++) {
      let name = "p" + parseInt(8 - y) + parseInt(x + 1);
      new PushButton(main, name, 30 + x * 20, 150 + y * 20);
   }
}


