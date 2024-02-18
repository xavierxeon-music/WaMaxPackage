// header
function setupDocument(docWidth, leftMargin, topMargin) {

   if (docWidth)
      document.body.style["width"] = docWidth.toString() + "px";
   if (leftMargin)
      document.body.style.marginLeft = leftMargin.toString() + "px";
   if (topMargin)
      document.body.style.marginTop = topMargin.toString() + "px";
}

function createTitle(text) {

   const title = createAndAppend("div");
   title.className = "title";
   title.innerText = text;
}

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
}

