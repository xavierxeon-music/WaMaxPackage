// fader

// https://codepen.io/osublake/pen/jbRaMY

class MixerFader {

   constructor(parent) {

      inlineHTML(parent, "./mixer/_mixer_fader.svg")

      this.levlelIndicatorLeft = parent.querySelector("rect.levlelLeft");
      this.levlelIndicatorRight = parent.querySelector("rect.levlelRight");

      this.update();
   }

   update() {

      let volumeLeft = 60.0;
      let volumeRight = 90.0;

      this.levlelIndicatorLeft.setAttribute("y", (100 - volumeLeft).toString());
      this.levlelIndicatorLeft.setAttribute("height", (volumeLeft).toString());

      this.levlelIndicatorRight.setAttribute("y", (100 - volumeRight).toString());
      this.levlelIndicatorRight.setAttribute("height", (volumeRight).toString());
   }
}

