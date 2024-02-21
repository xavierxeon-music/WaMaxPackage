//
setupDocument(600, 1, 1);
new Title("mixer");

let tableFrame = new InlineHTML("./mixer/_mixer_layout.html");

let masterFader = document.getElementById("master_fader");
new MixerFader(masterFader);
