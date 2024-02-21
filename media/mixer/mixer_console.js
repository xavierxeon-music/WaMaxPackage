addStyle("./mixer/mixer_console.css");


function addScript(jsFile, toHeader) {

   return new Promise(function (resolve, reject) {

      let script = document.createElement('script');
      script.src = jsFile;
      script.type = 'text/javascript';

      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);

      if (toHeader)
         document.getElementsByTagName('head').item(0).appendChild(script);
      else
         document.body.appendChild(script);

   });
}

async function includeNow(jsFile, toHeader) {
   await addScript(jsFile, toHeader);
   console.log(jsFile);
}


addScript("./mixer/_mixer_fader.js", true);
addScript("./mixer/_mixer_knob.js", true);


//include("./mixer/_mixer_fader.js", true);
//include("./mixer/_mixer_knob.js", true);

setupDocument(600, 1, 1);
new Title("mixer");

let tableFrame = new InlineHTML("./mixer/_mixer_layout.html");
console.log("A");

let masterFader = document.getElementById("master_fader");
new MixerFader(masterFader);
