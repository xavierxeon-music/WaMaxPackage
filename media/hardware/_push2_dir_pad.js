//

class PushDirPad extends BaseElement {

   constructor(parent, id, x, y) {

      super("div", parent);

      this.element.className = "pushdirpad";

      this.move(x, y);
   }
}