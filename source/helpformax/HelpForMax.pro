TARGET = HelpForMax
TEMPLATE = app

QT += widgets  svg
CONFIG += c++20

DESTDIR = ../bin

macx {
   QMAKE_CXXFLAGS += -Werror
   ICON = $$PWD/icons/HelpForMax.icns
   CONFIG(release, debug|release){
      DESTDIR = ~/Applications
      QMAKE_POST_LINK = $$(QTDIR)/bin/macdeployqt $${DESTDIR}/$${TARGET}.app
   }    
}

windows {
   QMAKE_CXXFLAGS += /WX
   RC_ICONS = $$PWD/icons/HelpForMax.ico
   CONFIG(release, debug|release) {
      QMAKE_POST_LINK = $$(QTDIR)/bin/windeployqt --no-translations --no-system-d3d-compiler --compiler-runtime $${DESTDIR}/$${TARGET}.exe
   }
}


#include(Overview/04_Overview.pri)
include(Common.pri)

HEADERS += \
   MainWindow.h \
   Server.h \
   Socket.h

SOURCES += \
   MainWindow.cpp \
   Server.cpp \
   Socket.cpp

RESOURCES += \
   icons/icons.qrc
