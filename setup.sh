#!/bin/bash

SOURCE=$(pwd)
TARGET=~/Documents/Max\ 8/Packages

if [ ! -d "$TARGET" ]
then
   echo "No Max installation at $TARGET"
   exit
fi

if [ -e "$TARGET/WaMaxPackage" ]
then 
   rm  "$TARGET/WaMaxPackage" 
   echo "remove exising link"
fi

ln -s "$SOURCE" "$TARGET/WaMaxPackage"
echo "DONE"

if [ ! -f build ]
then
   git submodule update --init --recursive

   mkdir build
   cd build 
  
   cmake ..
   cmake --build . --parallel
fi