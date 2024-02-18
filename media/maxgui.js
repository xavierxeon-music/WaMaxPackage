
function createAndAppend(type, parent) {

   let thing = document.createElement(type);
   if (parent)
      parent.appendChild(thing);
   else
      document.body.appendChild(thing);

   return thing;
}

function include(file, path) {

   let script = document.createElement('script');
   if (path)
      script.src = path + "/" + file;
   else
      script.src = "./_maxgui/" + file;

   script.type = 'text/javascript';
   // script.defer = true;

   document.getElementsByTagName('head').item(0).appendChild(script);
}

class BaseElement {

   constructor(type, parent) {

      this.element = createAndAppend(type, parent);
   }

   setAttribute(key, value) {
      return this.element.setAttribute(key, value);
   }

   setStyle(key, value) {
      this.element.style[key] = value;
   }

   appendChild(element) {
      this.element.appendChild(element);
   }
}

include("dummy.js");
include("ringbuffer.js");

include("other.js");

include("tab.js");
include("slider.js");
include("canvas.js");
include('table.js');
