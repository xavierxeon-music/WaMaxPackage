// 

class CircleOfFiths extends BaseElement {

   constructor(parent) {

      super("div", parent);

      this.setStyle("background", "#aaaa44");
      this.setStyle("width", "300px");
      this.setStyle("height", "300px");


      inlineHTML(this.element, "./tuning/CircleOfFiths.svg");
   }
};

//
setupDocument(800, 1, 1);
let title = new Title("Qunatizer");

let main = new Div(document.body);
main.setStyle("background", "#444444");
//main.forceHeigth("300px");

let scale = new CircleOfFiths(main);

