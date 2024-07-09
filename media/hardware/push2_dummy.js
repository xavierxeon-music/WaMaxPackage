//



// gui
setupDocument(320, 1, 1);
let title = new Title("Push 2");
let main = new Div(document.body);
main.setStyle("background", "#444444");
main.forceHeigth("300px");


// left
new PushButton(main, "tap", 10, 50);
new PushButton(main, "metro", 30, 50);

new PushButton(main, "delete", 10, 75);
new PushButton(main, "undo", 10, 95);

new PushButton(main, "mute", 10, 120);
new PushButton(main, "solo", 30, 120);
new PushButton(main, "stop", 50, 120);

//
new PushButton(main, "convet", 10, 150);
new PushButton(main, "double_loop", 10, 170);
new PushButton(main, "quantize", 10, 190);

new PushButton(main, "duplicate", 10, 210);
new PushButton(main, "new", 10, 230);

new PushButton(main, "fixed_length", 10, 250);
new PushButton(main, "automate", 10, 270);
new PushButton(main, "record", 10, 290);

new PushButton(main, "play", 40, 290);


// center
for (let x = 0; x < 8; x++) {
   new PushButton(main, "t" + parseInt(x + 1), 80 + x * 20, 50);
   new PushButton(main, "b" + parseInt(x + 1), 80 + x * 20, 120);
   for (let y = 0; y < 8; y++) {
      let name = "p" + parseInt(8 - y) + parseInt(x + 1);
      let pad = new PushPad(main, name, 80 + x * 20, 150 + y * 20);
   }
}

// right
new PushButton(main, "setup", 270, 50);
new PushButton(main, "user", 290, 50);

new PushButton(main, "add_device", 250, 75);
new PushButton(main, "device", 270, 75);
new PushButton(main, "mix", 290, 75);

new PushButton(main, "add_track", 250, 95);
new PushButton(main, "browse", 270, 95);
new PushButton(main, "clip", 290, 95);

new PushButton(main, "master", 250, 120);

new PushButton(main, "1_32t", 250, 150);
new PushButton(main, "1_32", 250, 170);
new PushButton(main, "1_16t", 250, 190);

new PushButton(main, "1_16", 250, 210);
new PushButton(main, "repeat", 270, 210);
new PushButton(main, "accent", 290, 210);

new PushButton(main, "1_8t", 250, 230);
new PushButton(main, "1_8", 250, 250);
new PushButton(main, "1_4t", 250, 270);
new PushButton(main, "1_4", 250, 290);


