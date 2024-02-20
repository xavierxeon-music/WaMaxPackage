addStyle("./mixer/mixer_console.css");
include("./mixer/mixer_fader.js", true);
include("./mixer/mixer_knob.js", true);

setupDocument(600, 1, 1);
new Title("mixer");

let tableFrame = new InlineHTML("./mixer/mixer_layout.html");
