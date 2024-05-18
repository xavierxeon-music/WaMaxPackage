#include "wa.push2_display.h"

#include <QMap>
#include <QPainter>

#include "../common.h"

// see https://www.qt.io/blog/2015/12/15/ableton-push-qt-in-music-making

// see https://github.com/pixsperdavid/imp.push
// see https://github.com/xavierxeon-music/MusicHub/blob/master/src/Peripherals/Push2Display.cpp

static const QSize displaySize(960, 160);
static const int dataLength = 1024 * 160 * 2; // RGB 16 image

push2_display::push2_display()
   : object<push2_display>()
   , matrix_operator<>(false)
   , input{this, "(matrix) Input", "matrix"}
   , output{this, "(matrix) output", "matrix"}
   , updateTimer{this, minBind(this, &push2_display::timerFunction)}
   , context(nullptr)
   , device(nullptr)
   , data(nullptr)
   , image(displaySize, QImage::Format_ARGB32_Premultiplied)
{
   defaultImage();

   libusb_init(&context);

   transferBuffer();
   updateTimer.delay(100);

   data = new uchar[dataLength];
   for (int index = 0; index < dataLength; index++)
      data[index] = 0;
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

   delete[] data;
}

template <typename matrix_type>
matrix_type push2_display::calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position)
{
   return matrix_type{};
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   const int x = position.x();
   if (x < 0 || x >= displaySize.width())
      return pixel{};

   const int y = position.y();
   if (y < 0 || y >= displaySize.height())
      return pixel{};

   const uchar r = input[red];
   const uchar g = input[green];
   const uchar b = input[blue];

   setColor(x, y, r, g, b);

   return pixel{};
}

void push2_display::setColor(int x, int y, uchar red, uchar green, uchar blue)
{
   const QColor newColor(red, green, blue);
   image.setPixelColor(x, y, newColor);

   return;

   const ushort r = red / 8;   // max 32 colors = 5 bit -> shift by 0
   const ushort g = green / 4; // max 64 colors = 6 bit -> shift by 5
   const ushort b = blue / 8;  // max 32 colors = 5 bit -> shift by 5 + 6
   ushort color = (r << 0) + (g << 5) + (b << 11);

   const int index = 2 * (x + (1024 * y));
   if (index >= dataLength)
      return;
   ushort* dst = (ushort*)data;
   dst += index;

   *dst = color;
}

atoms push2_display::timerFunction(const atoms& args, const int inlet)
{
   transferBuffer();
   updateTimer.delay(100);

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

   updateBuffer();

   static uchar header[] = {0xEF, 0xCD, 0xAB, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
   static const uchar endpoint = 0x01 | LIBUSB_ENDPOINT_OUT;
   static const uint timeout = 1000;

   int transferred = 0;

   // header
   libusb_bulk_transfer(device, endpoint, header, sizeof(header), &transferred, timeout);

   // data
   libusb_bulk_transfer(device, endpoint, data, dataLength, &transferred, timeout);

   // device no longer available
   if (0 == transferred)
   {
      libusb_release_interface(device, 0);
      libusb_close(device);
      device = nullptr;
   }
}

void push2_display::updateBuffer()
{
   // convert to push 2 display format
   // rgb 565, BGR
   const QImage formatedImage = image.convertToFormat(QImage::Format_RGB16).rgbSwapped();

   QImage buffer(QSize(1024, 160), QImage::Format_RGB16);
   buffer.fill(Qt::black);

   // padd image
   QPainter painter;
   painter.begin(&buffer);
   painter.drawImage(QPoint(0, 0), formatedImage);
   painter.end();

   std::memcpy(data, buffer.bits(), dataLength);
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