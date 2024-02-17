// slider

class Slider {

   constructor(parent, id, unit) {

      this.id = id;
      this.unit = unit;

      this.minValue = 0.0;
      this.maxValue = 100.0;
      this.expo = 1.0;

      this.slider = document.createElement("input");
      this.slider.type = "range";
      this.slider.className = "slider";
      this.slider.id = id;
      this.slider.value = 0.0;
      this.slider.setAttribute("orient", "vertical");


      this.span = document.createElement("span");
      this.setVavlue(0);

      this.setVavlue(0);
      this.applySliderValue();

      this.slider.oninput = () => {
         this.applySliderValue();
      }

      let divSlider = document.createElement("div");
      divSlider.style["margin-left"] = "5px";
      divSlider.style["margin-right"] = "5px";
      divSlider.appendChild(this.slider);
      parent.appendChild(divSlider);

      let divSpan = document.createElement("div");
      divSpan.style.textAlign = "right";
      divSpan.style["margin-right"] = "5px";
      divSpan.appendChild(this.span);
      parent.appendChild(divSpan);

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