// frame

class InlineHTML extends BaseElement {

   constructor(fileName, parent) {

      super("div", parent);

      var request = new XMLHttpRequest();

      request.onreadystatechange = () => {
         this.element.innerHTML = request.responseText;
      };

      request.open("GET", fileName, false);
      request.send(null);
   }
} 
