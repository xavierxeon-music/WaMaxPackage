function include(file) {

   let script = document.createElement('script');
   script.src = "./_maxgui/" + file;
   script.type = 'text/javascript';
   // script.defer = true;

   document.getElementsByTagName('head').item(0).appendChild(script);

}

include("dummy.js");
include("base_element.js");

include("other.js");

include("tab.js");
include("slider.js");
include("canvas.js");
include('table.js');
