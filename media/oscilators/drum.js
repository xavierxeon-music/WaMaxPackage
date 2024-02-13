const canvas = document.querySelector('#knob_canvas');
const ctx = canvas.getContext("2d");

let x = 100;
let y = 100;


max.bindInlet('doSomething', doSomething);
function doSomething(a, b) {
   max.outlet('foo', a, b);

   x = a;
   y = b;
   update();
}

function update() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ctx.beginPath();
   ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
   ctx.closePath();

   ctx.fillStyle = "#ff00ff";
   ctx.fill();
}

update();

