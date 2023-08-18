// spatial

isMultiObject.local = 1;
function isMultiObject(object) {

   if (undefined == object.getattrnames)
      return false;

   if ("mc." != object.maxclass.substr(0, 3) && "receive~" != object.maxclass)
      return false;


   var attrNames = object.getattrnames();
   for (var index in attrNames) {
      var name = attrNames[index];
      if ("chans" == name)
         return true;
   }

   return false;
}


setMultiChannels.local = 1;
function setMultiChannels(self, channelCount) {

   for (var child = self.patcher.firstobject; child != null; child = child.nextobject) {
      if (!isMultiObject(child))
         continue;

      child.message("chans", channelCount);
      //print("* ", child.maxclass, channelCount);
   }
}