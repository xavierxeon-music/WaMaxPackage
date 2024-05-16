#ifndef WaPush2DisplayH
#define WaPush2DisplayH

#include <libusb.h>

#include "c74_min.h"
using namespace c74::min;

#include <QImage>

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
   timer<> updateTimer;

private:
   atoms matrixFunction(const atoms& args, const int inlet);
   atoms timerFunction(const atoms& args, const int inlet);
   void updateBuffer();
   void transferBuffer();

private:
   libusb_context* context;
   libusb_device_handle* device;
   QImage image; // set pixels here
   int updateCounter;
   QImage buffer; // send to push device
};

#endif // NOT WaPush2DisplayH