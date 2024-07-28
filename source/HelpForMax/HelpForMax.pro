TARGET = HelpForMax
TEMPLATE = app

QT += widgets  svg network xml
CONFIG += c++20


macx {
   QMAKE_CXXFLAGS += -Werror
   QMAKE_INFO_PLIST = Info.plist
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
      DESTDIR = ../bin
      QMAKE_POST_LINK = $$(QTDIR)/bin/windeployqt --no-translations --no-system-d3d-compiler --compiler-runtime $${DESTDIR}/$${TARGET}.exe
   }
}

include(Edit/Edit.pri)
include(Block/Block.pri)


HEADERS += \
   MainWindow.h \
   MessageBar.h \
   OverviewGraph.h \
   PatchWidget.h \
   SocketPatchWidget.h \
   TabWidget.h \
   TestClient.h \
   HelpForMax.h \
   HelpForMax.hpp

SOURCES += \
   MainWindow.cpp \
   MessageBar.cpp \
   OverviewGraph.cpp \
   PatchWidget.cpp \
   SocketPatchWidget.cpp \
   TabWidget.cpp \
   TestClient.cpp

RESOURCES += \
   icons/icons.qrc

FORMS += \
    TestClient.ui
