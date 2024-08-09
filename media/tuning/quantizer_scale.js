// 

class CircleOfFiths extends Canvas {

   constructor(parent) {

      super(parent, 250, 400);

      this.img = new Image();
      this.img.src = "./tuning/CircleOfFiths.svg";
      this.img.onload = () => {
         this.update();
      }

      this.ctx.font = "bold 16px Arial";
      this.ctx.textAlign = "left";

      this.element.addEventListener("pointerdown", (clickEvent) => {
         this.#clicked(clickEvent.layerX, clickEvent.layerY);
      });
   }

   update() {

      this.clear();

      this.ctx.fillStyle = "#444444";
      this.ctx.fillText("Name", 5, 20);

      this.#drawKeys(20, 30);

      const cy = 120;
      let sector = 0;
      this.#drawMarker(sector, cy + 122);
      this.#drawMarker(sector + 6, cy + 122);
      this.circle(125, cy + 122, 25, "#444444");
      this.ctx.drawImage(this.img, 0, cy, 250, 250);

      this.ctx.fillText("Visu", 10, cy + 272);
   }

   #clicked(x, y) {
      debug("CLICK", x, y);
   }

   #polar(radius, angle) {

      let rad = angle * (Math.PI / 180);
      let x = radius * Math.cos(rad);
      let y = radius * Math.sin(rad);

      return [x, y];
   }

   #drawMarker(sector, cy) {

      const pieSize = (360 / 12);
      const offset = 8.5 * pieSize;
      let startAngle = offset + (sector + 0) * pieSize;
      let endAngle = offset + (sector + 1) * pieSize;

      this.ctx.fillStyle = "#cccccc";

      let cx = 125;

      this.ctx.beginPath();

      let [x0, y0] = this.#polar(30, startAngle);
      this.ctx.moveTo(cx + x0, cy + y0);

      let diffAngle = endAngle - startAngle;
      for (var fraction = 0.0; fraction < 1.0; fraction += 0.1) {
         let [x1, y1] = this.#polar(125, startAngle + fraction * diffAngle);
         this.ctx.lineTo(cx + x1, cy + y1);
      }

      let [x2, y2] = this.#polar(125, endAngle);
      this.ctx.lineTo(cx + x2, cy + y2);

      let [x3, y3] = this.#polar(30, endAngle);
      this.ctx.lineTo(cx + x3, cy + y3);

      this.ctx.lineTo(cx + x0, cy + y0);
      this.ctx.fill();

      this.ctx.closePath();
   }

   #drawKeys(x, y) {

      let keyWidth = 30;
      let keyHeight = 80;

      // white keys
      this.box(x + 0, y, keyWidth, keyHeight, "#eeeeee", "#444444");
      this.box(x + 1 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");
      this.box(x + 2 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");

      this.box(x + 3 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");
      this.box(x + 4 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");
      this.box(x + 5 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");
      this.box(x + 6 * keyWidth, y, keyWidth, keyHeight, "#eeeeee", "#444444");

      // black keys
      this.box(x + 2 + 0.5 * keyWidth, y, keyWidth - 4, 0.7 * keyHeight, "#444444", "#444444");
      this.box(x + 2 + 1.5 * keyWidth, y, keyWidth - 4, 0.7 * keyHeight, "#444444", "#444444");

      this.box(x + 2 + 3.5 * keyWidth, y, keyWidth - 4, 0.7 * keyHeight, "#444444", "#444444");
      this.box(x + 2 + 4.5 * keyWidth, y, keyWidth - 4, 0.7 * keyHeight, "#444444", "#444444");
      this.box(x + 2 + 5.5 * keyWidth, y, keyWidth - 4, 0.7 * keyHeight, "#444444", "#444444");
   }
};

//
setupDocument(264, 1, 1);
let title = new Title("Qunatizer");

let main = new Div();
main.setStyle("background", "#444444");
main.setStyle("padding", "5px");

let canvas = new CircleOfFiths(main);
canvas.update();

let nameEdit = createAndAppend("input", main);
nameEdit.type = "text";
nameEdit.className = "lineedit";
move(nameEdit, 60, 30);

let clearButton = new Button(main, "clear");
clearButton.onClicked(clearVisu);
clearButton.move(60, 400);

let resendButton = new Button(main, "resend");
resendButton.onClicked(resendVisu);
resendButton.move(110, 400);

// name 

// name

max.bindInlet('setName', setName);
function setName(name) {
   nameEdit.value = name;
}

nameEdit.addEventListener("change", () => {
   max.outlet("updateName", nameEdit.value);
});

// visu

function clearVisu() {

}

function resendVisu() {

}

