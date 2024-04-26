#include "wa.push2_display.h"

#include "../common.h"

// see https://www.qt.io/blog/2015/12/15/ableton-push-qt-in-music-making

// see https://github.com/pixsperdavid/imp.push
// see https://github.com/xavierxeon-music/MusicHub/blob/master/src/Peripherals/Push2Display.cpp

push2_display::push2_display()
   : input{this, "(matrix) Input", "matrix"}
   , output{this, "(matrix) Output", "matrix"}
   , context(nullptr)
   , device(nullptr)
   , data(nullptr)
{
   data = new uchar[16384];

   libusb_init(&context);

   device = libusb_open_device_with_vid_pid(context, 0x2982, 0x1967);
   if (!device)
      return;

   libusb_claim_interface(device, 0);
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
   matrix_type output;
   return output;
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   pixel output;

   /*
   output[alpha] = clamp(input[alpha], cmin, cmax);
   output[red] = clamp(input[red], cmin, cmax);
   output[green] = clamp(input[green], cmin, cmax);
   output[blue] = clamp(input[blue], cmin, cmax);
   */
   return output;
}

void push2_display::transfer()
{
   if (!device)
   {
      device = libusb_open_device_with_vid_pid(context, 0x2982, 0x1967);
      if (!device)
         return;

      libusb_claim_interface(device, 0);
   }

   static uchar header[] = {0xEF, 0xCD, 0xAB, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
   static const uchar endpoint = 0x01 | LIBUSB_ENDPOINT_OUT;
   static const uint timeout = 1000;
   static const int dataLength = 20 * 16384; // ????

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

MIN_EXTERNAL(push2_display);