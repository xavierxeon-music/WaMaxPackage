// maxgui

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

   move(x, y) {

      this.element.style["position"] = "absolute";
      this.element.style["left"] = x.toString() + "px";
      this.element.style["top"] = y.toString() + "px";
   }
}

// header
function setupDocument(docWidth, leftMargin, topMargin) {

   if (docWidth)
      document.body.style["width"] = docWidth.toString() + "px";
   if (leftMargin)
      document.body.style.marginLeft = leftMargin.toString() + "px";
   if (topMargin)
      document.body.style.marginTop = topMargin.toString() + "px";
}

// includes
include("maxdummy.js");
include("ringbuffer.js");

include("div.js");
include("button.js");
include("tab.js");
include("slider.js");
include("canvas.js");
include('table.js');
