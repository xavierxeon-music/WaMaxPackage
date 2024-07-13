//

// gui
setupDocument(320, 1, 1);
let title = new Title("Push 2");
let main = new Div(document.body);
main.setStyle("background", "#444444");
main.forceHeigth("285px");

// left
new PushEncoder(main, "encoder1", 10, 20);
new PushEncoder(main, "encoder2", 30, 20);

new PushButton(main, "tap", 10, 50, true);
new PushButton(main, "metro", 30, 50, true);

new PushButton(main, "delete", 10, 70);
new PushButton(main, "undo", 10, 90);

new PushColorButton(main, "mute", 10, 115, true);
new PushColorButton(main, "solo", 30, 115, true);
new PushColorButton(main, "stop", 50, 115, true);

//
new PushButton(main, "convet", 10, 135);
new PushButton(main, "double_loop", 10, 155);
new PushButton(main, "quantize", 10, 175);

new PushButton(main, "duplicate", 10, 195);
new PushButton(main, "new", 10, 215);

new PushButton(main, "fixed_length", 10, 235);
new PushColorButton(main, "automate", 10, 255);
new PushColorButton(main, "record", 10, 275);

let play = new PushColorButton(main, "play", 40, 275);
play.setShape("<polygon points='5,3 13,8 5,13' stroke-width='0'/>");

// center
for (let x = 0; x < 8; x++) {
   let xPos = 80 + (x * 20);
   new PushEncoder(main, "encoder" + parseInt(x + 3), xPos, 20);
   new PushColorButton(main, "t" + parseInt(x + 1), xPos, 50, true);
   new PushColorButton(main, "b" + parseInt(x + 1), xPos, 115, true);
   for (let y = 0; y < 8; y++) {
      let name = "p" + parseInt(8 - y) + parseInt(x + 1);
      new PushPad(main, name, xPos, 135 + y * 20);
   }
}

// right
new PushEncoder(main, "encoder11", 290, 20);

new PushButton(main, "setup", 270, 50, true);
new PushButton(main, "user", 290, 50, true);

new PushButton(main, "add_device", 250, 70);
new PushButton(main, "device", 270, 70);
new PushButton(main, "mix", 290, 70);

new PushButton(main, "add_track", 250, 90);
new PushButton(main, "browse", 270, 90);
new PushButton(main, "clip", 290, 90);

new PushButton(main, "master", 250, 115, true);
new PushDirPad(main, ["cursor_up", "cursor_left", "cursor_right", "cursor_down"], 270, 115);

new PushColorButton(main, "1_32t", 250, 135);
new PushColorButton(main, "1_32", 250, 155);
new PushColorButton(main, "1_16t", 250, 175);

new PushColorButton(main, "1_16", 250, 195);
new PushButton(main, "repeat", 270, 195);
new PushButton(main, "accent", 290, 195);

new PushColorButton(main, "1_8t", 250, 215);
new PushButton(main, "scale", 270, 215, true);
new PushButton(main, "layout", 290, 215, true);

new PushColorButton(main, "1_8", 250, 235);
new PushButton(main, "note", 270, 229);
new PushButton(main, "session", 290, 229);

new PushColorButton(main, "1_4t", 250, 255);
new PushDirPad(main, ["octave_up", "page_left", "page_right", "ocatave_down"], 270, 249);

new PushColorButton(main, "1_4", 250, 275);
new PushButton(main, "shift", 270, 281, true);
new PushButton(main, "select", 290, 281, true);

