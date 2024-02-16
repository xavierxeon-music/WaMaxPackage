createTitle("small rack", 180, 0, 0);

let tabBar = new TabBar([70, 30, 70]);
let tabA = tabBar.addTab("ES8", true);
let tabB = tabBar.addTab("Optix");

let portDict = {};

const es8Ports = [1, 2, 3, 4, 5, 6, 7, 8];
for (let index in es8Ports) {

   let sendKey = "se" + index.toString();
   let sendPort = createContent(tabA, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = createContent(tabA, es8Ports[index], "center");
   center.style.fontWeight = "bold";

   if (index < 4) {
      let receiveKey = "re" + index.toString();
      let receivePort = createContent(tabA, "&#9675;", "left", receiveKey);
      portDict[receiveKey] = receivePort;
   }
   else
      createContent(tabA, "", "left");

}

const optixPorts = [1, 2, 3, 4, 5, 6, 7, 8];
for (let index in es8Ports) {
   let sendKey = "so" + index.toString();
   let sendPort = createContent(tabB, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = createContent(tabB, es8Ports[index], "center");
   center.style.fontWeight = "bold";

   let receiveKey = "ro" + index.toString();
   let receivePort = createContent(tabB, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;
}

function blank() {

   let portLabels = document.getElementsByClassName("port_name");
   for (let i = 0; i < portLabels.length; i++) {
      portLabels[i].innerHTML = "&#9675;";
   }
}

max.bindInlet('loadDict', loadDict);
function loadDict() {

   blank();

   max.getDict("smallRackPorts", function (maxDict) {

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

