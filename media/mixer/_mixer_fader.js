// fader

class MixerFader {

   constructor(parent) {

      let svg = createAndAppend("svg", parent);
      svg.setAttribute("width", "20px");
      svg.setAttribute("height", "100px");

      let lines = createAndAppend("path", svg);
      lines.setAttribute("d", "M 1, 95 L 19, 95 M 1, 72.5 L 19, 72.5 M 1, 50 L 19, 50 M 1, 27.5 L 19, 27.5 M 1, 5 L 19, 5 ");
      lines.setAttribute("stroke", "#999");
      lines.setAttribute("stroke-width", "1");
      lines.setAttribute("stroke-linecap", "butt");

      let faderBox = createAndAppend("rect", svg);
      faderBox.setAttribute("x", "6");
      faderBox.setAttribute("y", "2");
      faderBox.setAttribute("width", "8");
      faderBox.setAttribute("height", "96");
      faderBox.setAttribute("rx", "3");
      faderBox.setAttribute("ry", "3");
      faderBox.setAttribute("stroke", "#000");
      faderBox.setAttribute("stroke-width", "2");
      faderBox.setAttribute("fill", "#555");
   }
}

/*
<svg width="20px" heigth="100px">
   <!--lines-->
   <path d="M 1,95 L 19,95 M 1,72.5 L 19,72.5 M 1,50 L 19,50 M 1,27.5 L 19,27.5 M 1,5 L 19,5 " stroke="#999"
      stroke-width="1" stroke-linecap="butt"></path>
   <!--fader box-->
   <rect x="6" y="2" width="8" height="96" rx="3" ry="3" stroke="#000" stroke-width="2" fill="#555"></rect>
   <!--indicator-->
   <rect x="7" width="6" rx="3" ry="3" stroke-width="0" fill="#ff0000" class="slider-track" y="54.2"
      height="43.8"></rect>
   <!--knob-->
   <rect x="3" width="14" height="6" rx="2" ry="2" stroke-width="0" fill="#d3d347" class="slider-cursor"
      y="54.2"></rect>
</svg>
*/