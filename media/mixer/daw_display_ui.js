
function blank() {

   let portLabels = document.getElementsByClassName("port_name");
   for (let i = 0; i < portLabels.length; i++) {
      portLabels[i].innerHTML = "";
   }
}

max.bindInlet('loadDict', loadDict);
function loadDict() {

   blank();

   max.getDict("dawDisplay", function (maxDict) {

      for (key in maxDict) {
         let output = document.querySelector("span#" + key);
         let text = maxDict[key];
         output.innerHTML = text;
      }
   });
}
