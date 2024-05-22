cmake_minimum_required(VERSION 3.5)

set(C74_MIN_API_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../min-api)
include(${C74_MIN_API_DIR}/script/min-pretarget.cmake)

# ############################################################
# MAX EXTERNAL
# ############################################################
include_directories(
   "${C74_INCLUDES}"
)

file(GLOB PROJECT_SRC
   "*.h"
   "*.c"
   "*.cpp"
)
add_library(
   ${PROJECT_NAME}
   MODULE
   ${PROJECT_SRC}
)

set(CMAKE_AUTOMOC ON)
find_package(Qt6 6.2 REQUIRED COMPONENTS Core Gui)
target_link_libraries(${PROJECT_NAME} PRIVATE Qt6::Core Qt6::Gui)

include(${C74_MIN_API_DIR}/script/min-posttarget.cmake)
