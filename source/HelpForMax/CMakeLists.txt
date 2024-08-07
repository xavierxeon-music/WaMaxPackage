cmake_minimum_required(VERSION 3.16)
project(SDKTool VERSION 0.0.1 LANGUAGES CXX)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT CMAKE_BUILD_TYPE)
   set(CMAKE_BUILD_TYPE DEBUG CACHE STRING "" FORCE)
endif()

message(STATUS "CMAKE_BUILD_TYPE: ${CMAKE_BUILD_TYPE}")

# Qt inclusion
find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_subdirectory(Common)
add_subdirectory(simpleCrypt)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Admin)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Checker)

file(GLOB_RECURSE ADMIN_FILES
   ${CMAKE_CURRENT_SOURCE_DIR}/Admin/*.h
   ${CMAKE_CURRENT_SOURCE_DIR}/Admin/*.cpp
   ${CMAKE_CURRENT_SOURCE_DIR}/executables/sdkAdmin.cpp
   ${CMAKE_CURRENT_SOURCE_DIR}/Common/gui/icons/icons.qrc
)
file(GLOB_RECURSE CHECKER_FILES
   ${CMAKE_CURRENT_SOURCE_DIR}/Checker/*.h
   ${CMAKE_CURRENT_SOURCE_DIR}/Checker/*.cpp
   ${CMAKE_CURRENT_SOURCE_DIR}/executables/sdkChecker.cpp
   ${CMAKE_CURRENT_SOURCE_DIR}/Common/gui/icons/icons.qrc
)

if(WIN32)
   qt_add_executable(sdkCreator WIN32 executables/sdkCreator.cpp)
   qt_add_executable(sdkChecker WIN32 ${CHECKER_FILES})
   qt_add_executable(sdkAdmin WIN32 ${ADMIN_FILES})
elseif(UNIX)
   qt_add_executable(sdkCreator executables/sdkCreator.cpp)
   qt_add_executable(sdkChecker ${CHECKER_FILES})
   qt_add_executable(sdkAdmin ${ADMIN_FILES})
endif()

target_link_libraries(sdkCreator PRIVATE Qt6::Widgets)
target_link_libraries(sdkChecker PRIVATE Qt6::Widgets)
target_link_libraries(sdkAdmin PRIVATE Qt6::Widgets)

target_link_libraries(sdkCreator PUBLIC common)
target_link_libraries(sdkAdmin PUBLIC common)
target_link_libraries(sdkChecker PUBLIC common)
