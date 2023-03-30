autowatch = 1;
inlets = 1;
outlets = 0;


var resizerHandle = null;

function loadbang() {

   if (!resizerHandle) {
      resizerHandle = new bPatcherResize();
   }
}

function bang() {

   resizerHandle.delayedResize();
}

function bPatcherResize() {

   // patch where the wa.setup.bpatcher is included
   var contentPatch = patcher.parentpatcher;
   //post(contentPatch.name, contentPatch.wind.title, contentPatch.maxclass, "\n");
   contentPatch.setattr("presentation", 1);

   this._compileContentSize = function () {

      var top = -1;
      var left = -1;
      var right = -1;
      var bottom = -1;

      for (var obj = contentPatch.firstobject; obj !== null; obj = obj.nextobject) {

         var isPresentation = obj.getattr("presentation");
         if (0 === isPresentation)
            continue;

         var obj_rect = obj.getattr("presentation_rect");
         if (obj_rect === null || obj_rect === undefined)
            continue;

         var oLeft = obj_rect[0];
         var oTop = obj_rect[1];
         var oRight = oLeft + obj_rect[2];
         var oBottom = oTop + obj_rect[3];

         if (left === -1 || left > oLeft) {
            left = oLeft;
         }
         if (top === -1 || top > obj_rect[1]) {
            top = obj_rect[1];
         }
         if (right === -1 || right < oRight) {
            right = oRight;
         }
         if (bottom === -1 || bottom < oBottom) {
            bottom = oBottom;
         }

      }

      var width = right - left;
      var height = bottom - top;

      return [width, height];
   }

   this._findBPatcher = function () {

      var includingPatch = contentPatch.parentpatcher;
      //post(includingPatch.name, includingPatch.wind.title, includingPatch.maxclass, "\n");

      for (var child = includingPatch.firstobject; child !== null; child = child.nextobject) {

         if ("patcher" !== child.maxclass)
            continue;

         var patchName = child.getattr("name");
         if (patchName !== contentPatch.name)
            continue;

         return child;
      }
      return null;
   }

   this.delayedResize = function () {

      post("delay resize", "\n");

      var bpatcher = this._findBPatcher();
      if (null === bpatcher)
         return;

      var size = this._compileContentSize();


      var boxSize = bpatcher.getboxattr("patching_rect");
      boxSize[2] = size[0];
      boxSize[3] = size[1];
      bpatcher.setboxattr("patching_rect", boxSize);
   }

   return this;
}
bPatcherResize.local = 1;
