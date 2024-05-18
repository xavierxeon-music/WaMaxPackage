#ifndef WaPush2DisplayH
#define WaPush2DisplayH

#include <thread>

#include <libusb.h>

#include "c74_min.h"
using namespace c74::min;

class push2_display : public object<push2_display>, public matrix_operator<>
{
public:
   MIN_DESCRIPTION{"Display matrix on Ableton Push2 display"};

public:
   push2_display();
   ~push2_display();

public:
   template <typename matrix_type>
   matrix_type calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position);

   pixel calc_cell(pixel input, const matrix_info& info, matrix_coord& position);

public:
   inlet<> input;
   outlet<> output; // needs matrix output !
   timer<> updateTimer;

private:
   ushort rgb16Color(uchar red, uchar green, uchar blue) const;
   void setColor(int x, int y, ushort color);
   atoms timerFunction(const atoms& args, const int inlet);
   void transferBuffer();

   void defaultImage();

private:
   libusb_context* context;
   libusb_device_handle* device;
   ushort* bufferData;
   uchar* sendData;
   std::mutex bufferMutex;
};

#endif // NOT WaPush2DisplayH