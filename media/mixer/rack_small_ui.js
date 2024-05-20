//
setupDocument(178, 1, 1);
new Title("small rack");

let tabBar = new TabBar([70, 30, 70]);
let tabA = tabBar.addTab("ES8");
tabA.setDefault();

// content

let portDict = {};

for (let index = 1; index <= 8; index++) {

   let sendKey = "se" + index.toString();
   let sendPort = new Div(tabA, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = new Div(tabA, index, "center");
   center.setStyle("font-weight", "bold");

   if (index <= 4) {
      let receiveKey = "re" + index.toString();
      let receivePort = new Div(tabA, "&#9675;", "left", receiveKey);
      portDict[receiveKey] = receivePort;
   }
   else {
      new Div(tabA, "", "left");
   }
}

// functionality

function blank() {

   for (let key in portDict) {
      let output = portDict[key];
      output.setText("&#9675;");
   }
}

max.bindInlet('loadDict', loadDict);
function loadDict() {

   blank();

   max.getDict("smallRackDisplay", function (maxDict) {

      for (key in maxDict) {

         let output = portDict[key];
         if (!output)
            continue;

         let text = maxDict[key];
         if (key[0] == "s")
            text = text + " &#10132;";
         else
            text = "&#10132; " + text;
         output.setText(text);
      }
   });
}

