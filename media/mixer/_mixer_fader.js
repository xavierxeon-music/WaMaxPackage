// fader

// https://codepen.io/osublake/pen/jbRaMY

class MixerFader {

   constructor(parent) {

      inlineHTML(parent, "./mixer/_mixer_fader.svg");

      this.svg = parent.querySelector("svg");
      this.transform = this.svg.getScreenCTM();

      this.midfader = parent.querySelector("rect.midfader");
      this.levlelIndicatorLeft = parent.querySelector("rect.levlelLeft");
      this.levlelIndicatorRight = parent.querySelector("rect.levlelRight");
      this.handle = parent.querySelector("rect.handle");
      this.handle.style["cursor"] = "grab";

      this.handle.addEventListener('mousedown', (event) => { this.#startDrag(event); });
      this.handle.addEventListener('mousemove', (event) => { this.#drag(event); });
      this.handle.addEventListener('mouseup', (event) => { this.#endDrag(event); });
      this.handle.addEventListener('mouseleave', (event) => { this.#endDrag(event); });

      this.midfader.addEventListener('click', (event) => { this.#moveSlider(event); });
      //this.midfader.addEventListener('dblclick', () => { this.#resetSlider(); });

      this.handleDrag = false;
      this.handleDragOffset = 0;

      // data 
      this.volumeLeft = 60.0;
      this.volumeRight = 90.0;
      this.level = 30.0;

      this.update();
   }

   update() {


      this.levlelIndicatorLeft.setAttribute("y", (100 - this.volumeLeft).toString());
      this.levlelIndicatorLeft.setAttribute("height", (this.volumeLeft).toString());

      this.levlelIndicatorRight.setAttribute("y", (100 - this.volumeRight).toString());
      this.levlelIndicatorRight.setAttribute("height", (this.volumeRight).toString());

      this.handle.setAttribute("y", (100 - this.level).toString());
   }

   #getMousePosition(evt) {
      let x = (evt.clientX - this.transform.e) / this.transform.a;
      let y = (evt.clientY - this.transform.f) / this.transform.d;
      return [x, y];
   }

   #updateLevel(event) {

      let y = this.#getMousePosition(event)[1];
      let nextLevel = (100 - y) + this.handleDragOffset;

      if (nextLevel < 0 || nextLevel > 100) {
         return false;
      }

      this.level = nextLevel;
      this.update();

      return true;
   }

   #startDrag(event) {
      this.handleDrag = true;
      this.handleDragOffset = this.level - (100 - this.#getMousePosition(event)[1]);
      this.handle.style["cursor"] = "grabbing";
   }

   #drag(event) {

      if (!this.handleDrag)
         return;

      if (!this.#updateLevel(event)) {
         this.handleDrag = false;
         this.handle.style["cursor"] = "grab";
      }
   }

   #endDrag(event) {
      this.handleDrag = false;
      this.handle.style["cursor"] = "grab";
   }

   #moveSlider(event) {
      this.handleDragOffset = 7;
      this.#updateLevel(event);
   }

   #resetSlider() {
      this.level = 100.0;
      this.update();
   }

}

