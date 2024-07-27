TARGET = TestClient
TEMPLATE = app

QT += widgets svg
CONFIG += c++20

DESTDIR = ../bin

macx {
   QMAKE_CXXFLAGS += -Werror
}

windows {
   QMAKE_CXXFLAGS += /WX
}


#include(Overview/04_Overview.pri)
include(Common.pri)

HEADERS += \
   TestClient.h

SOURCES += \
   TestClient.cpp

RESOURCES += \
   icons/icons.qrc

FORMS += \
    TestClient.ui
