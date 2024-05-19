#include "wa.push2_display.h"

#include <map>

#include "../common.h"

// see https://www.qt.io/blog/2015/12/15/ableton-push-qt-in-music-making
// see https://github.com/pixsperdavid/imp.push

static const int imageLength = 1024 * 160;
static const int dataLength = imageLength * 2; // RGB 16 image

push2_display::push2_display()
   : object<push2_display>()
   , matrix_operator<>(false)
   , input{this, "(matrix) Input", "matrix"}
   , output{this, "(matrix) output", "matrix"}
   , updateTimer{this, minBind(this, &push2_display::timerFunction)}
   , context(nullptr)
   , device(nullptr)
   , bufferData(nullptr)
   , sendData(nullptr)
   , bufferMutex()
{
   libusb_init(&context);
   device = libusb_open_device_with_vid_pid(context, 0x2982, 0x1967);
   if (device)
      libusb_claim_interface(device, 0);

   bufferData = new ushort[imageLength];
   std::memset(bufferData, 0, dataLength);
   defaultImage();

   sendData = new uchar[dataLength];
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

   delete[] bufferData;
   delete[] sendData;
}

template <typename matrix_type>
matrix_type push2_display::calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position)
{
   return matrix_type{};
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   const int x = position.x();
   if (x < 0 || x >= 960)
      return pixel{};

   const int y = position.y();
   if (y < 0 || y >= 160)
      return pixel{};

   const ushort color = rgb16Color(input[red], input[green], input[blue]);
   setColor(x, y, color);

   return pixel{};
}

ushort push2_display::rgb16Color(uchar red, uchar green, uchar blue) const
{
   const ushort r = (red / 8) << 0;   // max 32 colors = 5 bit -> shift by 0
   const ushort g = (green / 4) << 5; // max 64 colors = 6 bit -> shift by 5
   const ushort b = (blue / 8) << 11; // max 32 colors = 5 bit -> shift by 5 + 6

   const ushort color = r + g + b;
   return color;
}

void push2_display::setColor(int x, int y, ushort color)
{
   const int index = x + (1024 * y);
   if (index >= imageLength)
      return;

   bufferMutex.lock();
   bufferData[index] = color;
   bufferMutex.unlock();
}

atoms push2_display::timerFunction(const atoms& args, const int inlet)
{
   bufferMutex.lock();
   std::memcpy(sendData, bufferData, dataLength);
   bufferMutex.unlock();

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
      cout << "claim interface" << endl;
      return;
   }

   static const uchar endpoint = 0x01 | LIBUSB_ENDPOINT_OUT;
   static const uint timeout = 1000;

   int transferred = 0;

   // header
   static uchar header[] = {0xEF, 0xCD, 0xAB, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
   libusb_bulk_transfer(device, endpoint, header, sizeof(header), &transferred, timeout);

   // data
   libusb_bulk_transfer(device, endpoint, sendData, dataLength, &transferred, timeout);

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
   using PaddingMap = std::map<int, ushort>;
   static const PaddingMap paddingMap = {
      {0, rgb16Color(0, 0, 0)},
      {10, rgb16Color(255, 0, 0)},
      {20, rgb16Color(255, 255, 0)},
      {30, rgb16Color(0, 255, 0)},
      {40, rgb16Color(0, 255, 255)},
      {50, rgb16Color(0, 0, 255)},
      {60, rgb16Color(255, 0, 255)},
      {70, rgb16Color(255, 255, 255)},
   };

   for (PaddingMap::const_iterator it = paddingMap.cbegin(); it != paddingMap.cend(); it++)
   {
      const int padding = it->first;
      const ushort color = it->second;
      for (int x = padding; x < 960 - padding; x++)
      {
         for (int y = padding; y < 160 - padding; y++)
         {
            setColor(x, y, color);
         }
      }
   }
}

MIN_EXTERNAL(push2_display);