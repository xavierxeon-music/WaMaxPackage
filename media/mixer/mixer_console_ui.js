//
setupDocument(600, 1, 1);
new Title("mixer console");

let tableDiv = new Div();
tableDiv.inlineHTML("./mixer/_mixer_layout.html");

let masterFader = document.getElementById("master_fader");
new MixerFader(masterFader);

let channelFader = document.getElementById("channel_faders");
for (var index = 0; index < 10; index++) {
   var div = new Div(channelFader);
   div.makeHorizontal();
   new MixerFader(div.element);
}

let returnFader = document.getElementById("return_faders");
for (var index = 0; index < 2; index++) {
   var div = new Div(returnFader);
   div.makeHorizontal();
   new MixerFader(div.element);
}


