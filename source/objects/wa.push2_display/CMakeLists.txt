include(${CMAKE_CURRENT_SOURCE_DIR}/../../min-api/max-sdk-base/script/max-pretarget.cmake)

# ############################################################
# MAX EXTERNAL
# ############################################################
include_directories(
   "${MAX_SDK_INCLUDES}"
   "${MAX_SDK_MSP_INCLUDES}"
   "${MAX_SDK_JIT_INCLUDES}"
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

find_package(PkgConfig REQUIRED)
pkg_check_modules(libusb REQUIRED IMPORTED_TARGET libusb-1.0)
target_link_libraries(${PROJECT_NAME} PRIVATE PkgConfig::libusb)

include(${CMAKE_CURRENT_SOURCE_DIR}/../../min-api/max-sdk-base/script/max-posttarget.cmake)
