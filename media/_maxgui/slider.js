// slider

class Slider {

   constructor(parent, id, unit) {

      this.id = id;
      this.unit = unit;

      this.minValue = 0.0;
      this.maxValue = 100.0;
      this.expo = 1.0;

      // slider
      let divSlider = createAndAppend("div", parent);
      divSlider.style["margin-left"] = "5px";
      divSlider.style["margin-right"] = "5px";

      this.slider = createAndAppend("input", divSlider);
      this.slider.type = "range";
      this.slider.className = "slider";
      this.slider.id = id;
      this.slider.value = 0.0;
      this.slider.setAttribute("orient", "vertical");

      // span
      let divSpan = createAndAppend("div", parent);
      divSpan.style.textAlign = "right";
      divSpan.style["margin-right"] = "5px";

      this.span = createAndAppend("span", divSpan);

      // admin
      this.setVavlue(0);
      this.applySliderValue();

      this.slider.oninput = () => {
         this.applySliderValue();
      }
   }

   setRange(minValue, maxValue, expo) {

      this.minValue = minValue;
      this.maxValue = maxValue;
      this.expo = expo;

      this.slider.min = 0.0;
      this.slider.max = Math.pow(maxValue - minValue, 1.0 / expo);
      this.applySliderValue();
   }

   onValueChanged(callbackFunction) {
      this.onValueChangedFunction = callbackFunction;
   }

   setVavlue(value) {

      this.slider.value = Math.pow(value - this.minValue, 1.0 / this.expo);

      let text = value.toString();
      if (this.unit)
         text += " " + this.unit;
      this.span.innerHTML = text;
   }

   getValue() {

      let value = this.slider.value;
      value = this.minValue + Math.pow(value, this.expo);

      return value;
   }

   applySliderValue() {

      let value = this.slider.value;
      value = this.minValue + Math.pow(value, this.expo);

      if (this.onValueChangedFunction)
         this.onValueChangedFunction(this.id, value);

      value = Math.round(value);
      let text = value.toString();
      if (this.unit)
         text += " " + this.unit;
      this.span.innerHTML = text;
   }

   setVerical(isVertical) {
      if (isVertical)
         this.slider.style["transform"] = "rotate(-90deg)";
      else
         this.slider.style["transform"] = "rotate(0)";
   }
}

/*
<div id="dark-bg" class="grid">
   <svg class="slider" id="slider-dark1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 100">
      <path d="M 1,95 L 19,95 M 1,72.5 L 19,72.5 M 1,50 L 19,50 M 1,27.5 L 19,27.5 M 1,5 L 19,5 " stroke="#999" stroke-width="1" stroke-linecap="butt" class="slider-markers"></path>
      <rect x="6" y="2" width="8" height="96" rx="3" ry="3" stroke="#000" stroke-width="2" fill="#555" class="slider-track-bg"></rect>
      <rect x="7" width="6" rx="3" ry="3" stroke-width="0" fill="#bbb" class="slider-track" y="54.2" height="43.8"></rect>
      <rect x="3" width="14" height="6" rx="2" ry="2" stroke-width="0" fill="#d3d347" class="slider-cursor" y="54.2"></rect>
   </svg>
</div>
*/