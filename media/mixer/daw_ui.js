createTitle("daw", 178, 1, 1);

let tabBar = new TabBar([70, 30, 70]);
let tabA = tabBar.addTab("1-8");
tabA.setDefault();
let tabB = tabBar.addTab("9-16");
let tabC = tabBar.addTab("17-23");

// content

let portDict = {};

for (let index = 1; index <= 8; index++) {

   // tabA
   let sendKey = "s" + (index + 0).toString();
   let sendPort = new Div(tabA, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   let center = new Div(tabA, (index + 0), "center");
   center.setStyle("font-weight", "bold");

   let receiveKey = "r" + (index + 0).toString();
   let receivePort = new Div(tabA, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;

   // tabB
   sendKey = "s" + (index + 8).toString();
   sendPort = new Div(tabB, "&#9675;", "right", sendKey);
   portDict[sendKey] = sendPort;

   center = new Div(tabB, (index + 8), "center");
   center.setStyle("font-weight", "bold");

   receiveKey = "r" + (index + 8).toString();
   receivePort = new Div(tabB, "&#9675;", "left", receiveKey);
   portDict[receiveKey] = receivePort;

   // tabB
   if (index <= 7) {
      sendKey = "s" + (index + 16).toString();
      sendPort = new Div(tabC, "&#9675;", "right", sendKey);
      portDict[sendKey] = sendPort;

      center = new Div(tabC, (index + 16), "center");
      center.setStyle("font-weight", "bold");

      receiveKey = "r" + (index + 16).toString();
      receivePort = new Div(tabC, "&#9675;", "left", receiveKey);
      portDict[receiveKey] = receivePort;
   }
   else {
      var bgColor = "#373737";

      var right = new Div(tabC, "&#9675;", "right");
      right.setStyle("color", bgColor);

      center = new Div(tabC, "XXX", "center");
      center.setStyle("color", bgColor);
      center.setStyle("font-weight", "bold");

      var left = new Div(tabC, "&#9675;", "left");
      left.setStyle("color", bgColor);
   }
}

// functionality

function blank() {

   for (var key in portDict) {
      let output = portDict[key];
      output.setText("&#9675;");
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
         output.setText(text);
      }
   });
}

