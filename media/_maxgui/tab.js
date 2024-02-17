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