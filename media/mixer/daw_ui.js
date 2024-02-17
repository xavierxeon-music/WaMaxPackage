createTitle("daw", 178, 1, 1);

let tabBar = new TabBar([70, 30, 70]);
let tabA = tabBar.addTab("1-8", true);
let tabB = tabBar.addTab("9-16");
let tabC = tabBar.addTab("17-22");

// content

let portDict = {};

for (let index = 1; index <= 8; index++) {

   // tabA
   let sendKey = "s" + (index + 0).toString();
   let sendPort = createContent(tabA, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = createContent(tabA, (index + 0), "center");
   center.style.fontWeight = "bold";

   let receiveKey = "r" + (index + 0).toString();
   let receivePort = createContent(tabA, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;

   // tabB
   sendKey = "s" + (index + 8).toString();
   sendPort = createContent(tabB, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   center = createContent(tabB, (index + 8), "center");
   center.style.fontWeight = "bold";

   receiveKey = "r" + (index + 8).toString();
   receivePort = createContent(tabB, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;

   // tabB
   if (index <= 6) {
      sendKey = "s" + (index + 16).toString();
      sendPort = createContent(tabC, "&#9675;", "right", sendKey);
      portDict[sendKey] = sendPort;

      center = createContent(tabC, (index + 16), "center");
      center.style.fontWeight = "bold";

      receiveKey = "r" + (index + 16).toString();
      receivePort = createContent(tabC, "&#9675;", "left", receiveKey);
      portDict[receiveKey] = receivePort;
   }
   else {
      var bgColor = "#373737";

      var right = createContent(tabC, "&#9675;", "right");
      right.style.color = bgColor;

      center = createContent(tabC, "XXX", "center");
      center.style.color = bgColor;
      center.style.fontWeight = "bold";

      var left = createContent(tabC, "&#9675;", "left");
      left.style.color = bgColor;
   }
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

   max.getDict("dawDisplay", function (maxDict) {

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

