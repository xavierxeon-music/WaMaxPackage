createTitle("small rack", 178, 1, 1);

let tabBar = new TabBar([70, 30, 70]);
let tabA = tabBar.addTab("ES8", true);
let tabB = tabBar.addTab("Optix");

// content

let portDict = {};

for (let index = 1; index <= 8; index++) {

   let sendKey = "se" + index.toString();
   let sendPort = createContent(tabA, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = createContent(tabA, index, "center");
   center.style.fontWeight = "bold";

   if (index <= 4) {
      let receiveKey = "re" + index.toString();
      let receivePort = createContent(tabA, "&#9675;", "left", receiveKey);
      portDict[receiveKey] = receivePort;
   }
   else {
      createContent(tabA, "", "left");
   }

   sendKey = "so" + index.toString();
   sendPort = createContent(tabB, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   center = createContent(tabB, index, "center");
   center.style.fontWeight = "bold";

   receiveKey = "ro" + index.toString();
   receivePort = createContent(tabB, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;
}

// functionality

function blank() {

   for (var key in portDict) {
      let output = portDict[key];
      output.innerHTML = "&#9675;";
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
         output.innerHTML = text;
      }
   });
}

