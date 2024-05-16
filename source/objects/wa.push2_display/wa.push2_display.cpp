#include "wa.push2_display.h"

#include <QPainter>

#include "../common.h"

// see https://www.qt.io/blog/2015/12/15/ableton-push-qt-in-music-making

// see https://github.com/pixsperdavid/imp.push
// see https://github.com/xavierxeon-music/MusicHub/blob/master/src/Peripherals/Push2Display.cpp

static const QSize displaySize(960, 160);
const int maxCounter = 960 * 160;

push2_display::push2_display()
   : input{this, "(matrix) Input", "matrix"}
   , updateTimer{this, minBind(this, &push2_display::timerFunction)}
   , context(nullptr)
   , device(nullptr)
   , image(displaySize, QImage::Format_ARGB32_Premultiplied)
   , updateCounter(0)
   , buffer(QSize(1024, 160), QImage::Format_RGB16)
{
   image.fill(Qt::red);
   buffer.fill(Qt::red);

   libusb_init(&context);

   transferBuffer();
   updateTimer.delay(1000);
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
   matrix_type output;
   return output;
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   pixel output;
   if (info.plane_count() != 3 && info.plane_count() != 4)
      return output;

   const QColor newColor(input[red], input[green], input[blue]);
   const long x = position.x();
   const long y = position.y();

   image.setPixelColor(x, y, newColor);

   /*
   updateCounter++;
   if (updateCounter >= maxCounter)
   {
      updateCounter = 0;
      updateBuffer();
   }
   */

   return output;
}

atoms push2_display::timerFunction(const atoms& args, const int inlet)
{
   transferBuffer();

   updateTimer.delay(100);
   return {};
}

void push2_display::updateBuffer()
{
   const QImage formatedImage = image.convertToFormat(QImage::Format_RGB16).rgbSwapped();

   // padd image
   QPainter painter;
   buffer.fill(Qt::black);
   painter.begin(&buffer);
   painter.drawImage(QPoint(0, 0), formatedImage);
   painter.end();
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

   if (buffer.isNull())
      return;

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

MIN_EXTERNAL(push2_display);