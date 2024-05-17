#include "wa.push2_display.h"

#include <QMap>
#include <QPainter>

#include "../common.h"

// see https://www.qt.io/blog/2015/12/15/ableton-push-qt-in-music-making

// see https://github.com/pixsperdavid/imp.push
// see https://github.com/xavierxeon-music/MusicHub/blob/master/src/Peripherals/Push2Display.cpp

static const QSize displaySize(960, 160);

push2_display::push2_display()
   : object<push2_display>()
   , matrix_operator<>(false)
   , input{this, "(matrix) Input", "matrix"}
   , output{this, "(matrix) output", "matrix"}
   , updateTimer{this, minBind(this, &push2_display::timerFunction)}
   , context(nullptr)
   , device(nullptr)
   , image(displaySize, QImage::Format_ARGB32_Premultiplied)
   , buffer(QSize(1024, 160), QImage::Format_RGB16)
{
   defaultImage();
   buffer.fill(Qt::black);

   libusb_init(&context);

   transferBuffer();
   updateTimer.delay(100);
}

push2_display::~push2_display()
{
   if (device)
   {
      libusb_release_interface(device, 0);
      libusb_close(device);
   }

   if (context)
      libusb_exit(context);
}

template <typename matrix_type>
matrix_type push2_display::calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position)
{
   return matrix_type{};
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   const long x = position.x();
   if (x < 0 || x >= displaySize.width())
      return pixel{};

   const long y = position.y();
   if (y < 0 || y >= displaySize.height())
      return pixel{};

   // const pixel color = info.in_pixel(position);
   const QColor newColor(input[red], input[green], input[blue]);
   image.setPixelColor(x, y, newColor);

   return pixel{};
}

atoms push2_display::timerFunction(const atoms& args, const int inlet)
{
   transferBuffer();
   updateTimer.delay(100);

   std::cout << parallel_breakup_enabled() << std::endl;

   return {};
}

void push2_display::transferBuffer()
{
   if (!device)
   {
      device = libusb_open_device_with_vid_pid(context, 0x2982, 0x1967);
      if (!device)
         return;

      libusb_claim_interface(device, 0);
      return;
   }

   {
      // convert to push 2 display format
      const QImage formatedImage = image.convertToFormat(QImage::Format_RGB16).rgbSwapped();

      // padd image
      QPainter painter;
      buffer.fill(Qt::black);
      painter.begin(&buffer);
      painter.drawImage(QPoint(0, 0), formatedImage);
      painter.end();
   }

   static uchar header[] = {0xEF, 0xCD, 0xAB, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
   static const uchar endpoint = 0x01 | LIBUSB_ENDPOINT_OUT;
   static const uint timeout = 1000;
   static const int dataLength = 20 * 16384;

   int transferred = 0;

   // header
   libusb_bulk_transfer(device, endpoint, header, sizeof(header), &transferred, timeout);

   // data
   uchar* data = const_cast<uchar*>(buffer.bits());
   libusb_bulk_transfer(device, endpoint, data, dataLength, &transferred, timeout);

   // device no longer available
   if (0 == transferred)
   {
      libusb_release_interface(device, 0);
      libusb_close(device);
      device = nullptr;
   }
}

void push2_display::defaultImage()
{
   using PaddingMap = QMap<int, QColor>;
   static const PaddingMap paddingMap = {
      {0, QColor(0, 0, 0)},
      {10, QColor(255, 0, 0)},
      {20, QColor(255, 255, 0)},
      {30, QColor(0, 255, 0)},
      {40, QColor(0, 255, 255)},
      {50, QColor(0, 0, 255)},
      {60, QColor(255, 0, 255)},
      {70, QColor(255, 255, 255)},
   };

   QPainter painter;
   painter.begin(&image);

   for (PaddingMap::const_iterator it = paddingMap.constBegin(); it != paddingMap.constEnd(); it++)
   {
      const QBrush brush(it.value());

      const int padding = it.key();
      const QRect rect(padding, padding, displaySize.width() - (2 * padding), displaySize.height() - (2 * padding));

      painter.fillRect(rect, brush);
   }

   painter.end();
}

MIN_EXTERNAL(push2_display);