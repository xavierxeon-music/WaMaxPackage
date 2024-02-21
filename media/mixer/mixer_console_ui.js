//
setupDocument(600, 1, 1);
new Title("mixer console");

let tableDiv = new Div();
tableDiv.inlineHTML("./mixer/_mixer_layout.html");

let masterFader = document.getElementById("master_fader");
new MixerFader(masterFader);
