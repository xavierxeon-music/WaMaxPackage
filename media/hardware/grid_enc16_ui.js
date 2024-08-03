//
let turnDict = {};
let lastvalue = Date.now();
let buttonDict = {};
let nameDict = {};
let colorDict = {};

function sendReset() {

   max.outlet("reset", "bang");
}

max.bindInlet('refreshUI', refreshUI);
function refreshUI() {

   let diff = Date.now() - lastvalue;
   if (diff < 1000)
      return;

   for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {

         let index = ((4 - col) * 10) + (row + 1);
         turnDict[index] = 0;
      }
   }
   canvas.update();
}


max.bindInlet('turn', turn);
function turn(id, value) {

   lastvalue = Date.now();

   turnDict[id] = value;
   canvas.update();
}

max.bindInlet('button', button);
function button(id, state) {

   buttonDict[id] = state;
   canvas.update();
}

max.bindInlet('name', name);
function name(id, name) {

   nameDict[id] = name;
   canvas.update();
}

max.bindInlet('color', color);
function color(id, hexColor) {

   colorDict[id] = "#" + hexColor;
   canvas.update();
}


class GridCanvas extends Canvas {

   constructor() {

      super(document.body, 200, 200);
      this.padding = 5;

      this.ctx.font = "12px Arial";
      this.ctx.textAlign = "center";

      this.element.addEventListener("pointerdown", (clickEvent) => {
         this.#clicked(clickEvent.layerX, clickEvent.layerY);
      });
      this.element.addEventListener("pointerup", (clickEvent) => {
         this.#released(clickEvent.layerX, clickEvent.layerY);
      });
      this.element.addEventListener("pointercancel", (clickEvent) => {
         this.#released(clickEvent.layerX, clickEvent.layerY);
      });
   }

   update() {

      this.clear();

      var outlineColor = "#666666";
      var fullColor = "#ffffff";

      for (let row = 0; row < 4; row++) {
         for (let col = 0; col < 4; col++) {

            let x = 20 + (row * 50);
            let y = 20 + (col * 50);

            let index = ((4 - col) * 10) + (row + 1);

            // outer circle
            this.circle(x, y, 14, outlineColor);

            // knob indicator
            let value = turnDict[index];
            if (undefined == value)
               value == 0;

            if (value > 0)
               this.ring(x, y, 10, 7, fullColor, 0.5, -0.5 * Math.PI);
            else if (value < 0)
               this.ring(x, y, 10, 7, fullColor, 0.5, 0.5 * Math.PI);

            if (buttonDict[index]) {
               this.ring(x, y, 10, 7, fullColor, 0.5, -0.5 * Math.PI);
               this.ring(x, y, 10, 7, fullColor, 0.5, 0.5 * Math.PI);
            }


            // inner circle
            this.circle(x, y, 9, outlineColor);

            // color inidicator
            let color = colorDict[index];
            if (undefined == color)
               color = "#000000";

            this.circle(x, y, 7, color);


            // name 
            let name = nameDict[index];
            let fontColor = fullColor;
            if (undefined == name) {
               name = index.toString();
               fontColor = outlineColor;
            }

            this.ctx.fillStyle = fontColor;
            this.ctx.fillText(name, x, y + 25);

         }
      }
   }

   #clicked(x, y) {

      debug("clicked", x, y);
   }

   #released(x, y) {

      debug("released", x, y);
   }
}

//
setupDocument(201, 1, 1);
let title = new Title("grid enc16");
title.setStyle("height", "20px");

let resetButton = new Button(title, "reset");
resetButton.onClicked(sendReset);
resetButton.move(160, 3);

let canvas = new GridCanvas();
canvas.update();
