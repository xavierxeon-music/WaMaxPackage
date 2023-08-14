#!/bin/bash

SOURCE=$(pwd)
TARGET=~/Documents/Max\ 8/Packages

if [ ! -d "$TARGET" ]
then
   echo "No Max installation at $TARGET"
   exit
fi

if [ -d "$TARGET/WaMaxPackage" ]
then 
   rm  "$TARGET/WaMaxPackage" 
   echo "remove exising link"
fi

ln -s "$SOURCE" "$TARGET/WaMaxPackage"
echo "DONE"
