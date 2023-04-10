autowatch = 1;

// inlets and outlets
inlets = 0;
outlets = 0;

var steps = null;
var stepListener = null;
var sliders = null;


function loadbang() {

   steps = patcher.getnamed("steps");
   stepListener = new MaxobjListener(steps, "columns", update);
   sliders = patcher.getnamed("sliders");

   update();
}

function update() {

   const stepHeight = 30;
   const sliderHeight = 120;

   var columns = steps.getattr("columns");
   var width = stepHeight * columns;

   var stepPresentRect = steps.getattr("presentation_rect");
   stepPresentRect[2] = width;
   stepPresentRect[3] = stepHeight;
   steps.setattr("presentation_rect", stepPresentRect);

   var slidersPresentRect = sliders.getattr("presentation_rect");
   slidersPresentRect[2] = width;
   slidersPresentRect[3] = sliderHeight;
   sliders.setattr("presentation_rect", slidersPresentRect);

   //print("update", columns);

}
update.local = 1;
