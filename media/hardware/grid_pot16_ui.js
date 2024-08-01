//

let valueDict = {};
let nameDict = {};
let colorDict = {};

//max.bindInlet('reset', resetMessages);
function sendReset() {

   max.outlet("reset", "bang");
}

max.bindInlet('gridInput', gridInput);
function gridInput(id, value) {

   value = value / 16382.0;
   valueDict[id] = value;
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
   }

   update() {

      this.ctx.clearRect(0, 0, this.element.width, this.element.height);

      const zeroAngle = 0.5 * Math.PI;

      for (let row = 0; row < 4; row++) {
         for (let col = 0; col < 4; col++) {

            let x = 20 + (row * 50);
            let y = 20 + (col * 50);

            let index = ((4 - col) * 10) + (row + 1)

            this.ctx.strokeStyle = "#666666";

            this.ctx.beginPath();
            this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
            this.ctx.lineWidth = 6;
            this.ctx.stroke();
            this.ctx.closePath();

            let fraction = valueDict[index];
            if (undefined == fraction)
               fraction = 0.0;

            if (fraction > 0.0) {
               this.ctx.strokeStyle = "#ffffff";

               this.ctx.beginPath();
               this.ctx.arc(x, y, 10, zeroAngle, zeroAngle + (fraction * 2 * Math.PI));
               this.ctx.lineWidth = 6;
               this.ctx.stroke();
               this.ctx.closePath();
            }

            let color = colorDict[index];
            if (undefined == color)
               color = "#000000";
            this.ctx.fillStyle = color;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            let name = nameDict[index];
            this.ctx.fillStyle = "#ffffff";
            if (undefined == name) {
               name = index.toString();
               this.ctx.fillStyle = "#666666";
            }

            this.ctx.fillText(name, x, y + 25);

         }
      }
   }
}

//
setupDocument(201, 1, 1);
let title = new Title("grid pot16");
title.setStyle("height", "20px");

let resetButton = new Button(title, "reset");
resetButton.onClicked(sendReset);
resetButton.move(150, 2);

let canvas = new GridCanvas();
canvas.update();
