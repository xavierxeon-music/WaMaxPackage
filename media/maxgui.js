// maxgui

function createAndAppend(type, parent) {

   let thing = document.createElement(type);
   if (parent)
      parent.appendChild(thing);
   else
      document.body.appendChild(thing);

   return thing;
}

function include(jsFile, toHeader) {

   if (undefined == toHeader)
      toHeader = true;

   let script = document.createElement('script');
   script.src = jsFile;

   script.type = 'text/javascript';
   // script.defer = true;

   if (toHeader)
      document.getElementsByTagName('head').item(0).appendChild(script);
   else
      document.body.appendChild(script);
}

function addStyle(styleFile) {

   if (styleFile == undefined)
      return;

   let link = document.createElement("link");
   link.setAttribute("rel", "stylesheet");
   link.setAttribute("type", "text/css");
   link.setAttribute("href", styleFile);

   document.getElementsByTagName('head').item(0).append(link);
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

// standard includes
include("./_maxgui/maxdummy.js");
include("./_maxgui/ringbuffer.js");

include("./_maxgui/inline_html.js");

include("./_maxgui/div.js");
include("./_maxgui/button.js");
include("./_maxgui/tab.js");
include("./_maxgui/slider.js");
include("./_maxgui/canvas.js");
include('./_maxgui/table.js');
