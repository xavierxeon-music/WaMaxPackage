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

// div
class Div extends BaseElement {

   constructor(parent, value, alignment, id) {

      super(parent, "div");

      this.textNode = this.element;

      if (id) {
         let span = document.createElement("span");
         span.setAttribute("id", id);
         this.textNode = span;
         this.element.appendChild(span);
      }

      if (value)
         this.setText(value.toString());

      if (alignment)
         this.element.style.textAlign = alignment;
   }

   setText(text) {
      this.textNode.innerHTML = text;
   }
}

