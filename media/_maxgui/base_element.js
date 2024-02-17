// base elemet

class BaseElement {

   constructor(parent, name) {

      this.element = document.createElement(name);
      parent.appendChild(this.element);
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
