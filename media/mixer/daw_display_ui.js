
function blank() {

   let portLabels = document.getElementsByClassName("port_name");
   for (let i = 0; i < portLabels.length; i++) {
      portLabels[i].innerHTML = "&#9675;";
   }
}

max.bindInlet('loadDict', loadDict);
function loadDict() {

   blank();

   max.getDict("dawDisplay", function (maxDict) {

      for (key in maxDict) {
         let output = document.querySelector("span#" + key);
         let text = maxDict[key];
         if (key[0] == "s")
            text = text + " &#10132;";
         else
            text = "&#10132; " + text;
         output.innerHTML = text;
      }
   });
}
