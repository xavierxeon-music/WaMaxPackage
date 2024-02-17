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
class Div {

   constructor(parent, value, alignment, id) {

      this.element = document.createElement("div");

      if (id) {
         let span = document.createElement("span");
         span.setAttribute("id", id);
         if (value)
            span.innerHTML = value.toString();
         this.element.appendChild(span);
      }
      else if (value) {
         this.element.innerHTML = value.toString();
      }

      if (alignment)
         this.element.style.textAlign = alignment;
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

