//

class PushEncoder extends BaseElement {

   constructor(parent, id, x, y) {

      super("div", parent);

      this.element.className = "pushencoder";

      this.move(x, y);
   }
}