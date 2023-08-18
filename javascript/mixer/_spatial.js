// spatial

isMultiObject.local = 1;
function isMultiObject(object, ignoreList) {

   if (undefined == object.getattrnames)
      return false;

   for (var index in ignoreList) {
      var name = ignoreList[index];
      if (object.maxclass == name)
         return false;
   }

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
function setMultiChannels(self, channelCount, ignoreList) {

   if (undefined == ignoreList)
      ignoreList = [];

   for (var child = self.patcher.firstobject; child != null; child = child.nextobject) {
      if (!isMultiObject(child, ignoreList))
         continue;

      child.message("chans", channelCount);
      //print("* ", child.maxclass, channelCount);
   }
}