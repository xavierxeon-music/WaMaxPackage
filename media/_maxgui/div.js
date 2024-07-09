// div

class Div extends BaseElement {

   constructor(parent, value, alignment, id) {

      super("div", parent);

      this.textNode = this.element;

      if (id) {
         let span = createAndAppend("span", this.element);
         span.setAttribute("id", id);
         this.textNode = span;
      }

      if (value)
         this.setText(value.toString());

      if (alignment)
         this.element.style.textAlign = alignment;
   }

   setText(text) {
      this.textNode.innerHTML = text;
   }

   forceHeigth(height) {
      this.setStyle("height", height);
      this.setStyle("overflow-x", "hidden");
      this.setStyle("overflow-y", "auto");
   }

   makeHorizontal() {
      this.setStyle("float", "left");
      this.setStyle("clear", "none");
   }
}

class Title extends BaseElement {

   constructor(text) {

      super("div");
      this.name = text;

      this.element.className = "title";
      this.element.innerText = this.name;
   }

   showMessage(text) {
      this.element.innerHTML = this.name + " [" + text + "]";
   }

   clearMessage() {
      this.element.innerText = this.name;
   }
}
