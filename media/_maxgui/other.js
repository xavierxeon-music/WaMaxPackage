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
