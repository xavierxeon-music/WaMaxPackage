// frame

class InlineHTML extends BaseElement {

   constructor(fileName, parent) {

      super("div", parent);

      let request = new XMLHttpRequest();
      request.open("GET", fileName, false);
      request.send(null);

      this.element.innerHTML = request.responseText;
   }
} 
