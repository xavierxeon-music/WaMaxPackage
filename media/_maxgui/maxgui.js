// https://docs.cycling74.com/max8/vignettes/jwebcommunication


// debugging
class MaxDummy {

   constructor() {
      this.dummy = true;
   }

   bindInlet(name, functionName) { }

   outlet() {
      let text = "";
      for (let i = 0; i < arguments.length; i++) {
         if (i != 0)
            text += " ";
         text += arguments[i];
      }
      console.log("MAX OUTLET:", text);
   }

   getDict(name, functionName) {
      let localDict = {};
      functionName(localDict);
   }
   setDict(name, value) { }
}

if (window.max == undefined)
   window.max = new MaxDummy();

function debug() {
   let text = "";
   for (let i = 0; i < arguments.length; i++) {
      if (i != 0)
         text += " ";
      text += arguments[i];
   }

   if (window.max.dummy != undefined) {
      console.log("DEBUG:", text);
   }
   else {
      max.outlet("DEBUG", text);
   }
}

// html style bindings
max.bindInlet('bodyStyle', bodyStyle);
function bodyStyle(name, value) {
   document.body.style[name] = value;
}

// header
function createTitle(text, docWidth, leftMargin, topMargin) {

   if (docWidth)
      document.body.style["width"] = docWidth.toString() + "px";
   if (leftMargin)
      document.body.style.marginLeft = leftMargin.toString() + "px";
   if (topMargin)
      document.body.style.marginTop = topMargin.toString() + "px";

   const title = document.createElement("div");
   title.className = "title";
   title.innerText = text;
   document.body.appendChild(title);
}

// tabs

class TabContainer {

}

class TabBar {

   constructor(defaultLayout, height) {

      this.layouttext = TabBar.#extractLayout(defaultLayout);
      this.height = height;

      this.element = document.createElement("div");
      this.element.setAttribute("class", "tabbar");
      document.body.appendChild(this.element);

      this.buttonDict = {};
   }

   addTab(title, defaultOpen, localLayout, color) {

      let id = btoa(title);

      let tabbutton = document.createElement("button");
      tabbutton.setAttribute("class", "tabbutton");
      tabbutton.addEventListener("click", (evt) => { this.#showTab(evt, id); });
      if (color) {
         tabbutton.style["color"] = color;
      }
      //tabbutton.setAttribute("onclick", "TabBar.showTab(event, '" + id + "')");
      tabbutton.innerText = title;
      this.element.appendChild(tabbutton);

      let tabcontent = document.createElement("div");
      tabcontent.setAttribute("class", "tabcontent");
      tabcontent.setAttribute("id", id);
      if (this.height)
         tabcontent.style["height"] = this.height.toString() + "px";
      document.body.appendChild(tabcontent);

      this.buttonDict[tabcontent] = tabbutton;
      debug(tabcontent, typeof tabcontent);

      if (localLayout) {
         let locallayouttext = TabBar.#extractLayout(localLayout);
         tabcontent.style.gridTemplateColumns = locallayouttext;
      }
      else if (this.layouttext) {
         tabcontent.style.gridTemplateColumns = this.layouttext;
      }

      if (defaultOpen) {
         tabbutton.className += " active";
         tabcontent.style.display = "grid";
      }
      else {
         tabcontent.style.display = "none";
      }

      return tabcontent;
   }

   #showTab(evt, tabName) {

      // hide all tabs
      let tabcontent = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontent.length; i++) {
         tabcontent[i].style.display = "none";
      }

      // deactivae all tab buttons
      let tabbutton = document.getElementsByClassName("tabbutton");
      for (let i = 0; i < tabbutton.length; i++) {
         tabbutton[i].className = tabbutton[i].className.replace(" active", "");
      }

      // show current tab and active corresponfing button
      document.getElementById(tabName).style.display = "grid";
      evt.currentTarget.className += " active";
   }

   static #extractLayout(layout) {

      if (!layout)
         return undefined;

      let text = "";
      for (let index in layout) {
         if (0 != text.length)
            text += " ";

         var value = layout[index];
         if ("number" == typeof value)
            value = value.toString() + "px";

         text += value;
      }
      return text;
   }
}

// div
function createContent(parent, value, alignment, id) {

   let content = document.createElement("div");
   if (id) {
      let span = document.createElement("span");
      span.setAttribute("id", id);
      span.innerHTML = value.toString();
      content.appendChild(span);
   }
   else {
      content.innerHTML = value.toString();
   }

   content.style.textAlign = alignment;
   parent.appendChild(content);

   return content;
}
