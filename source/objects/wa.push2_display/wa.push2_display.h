#ifndef wa_push2_displayH
#define wa_push2_displayH

#include <inttypes.h>

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

#include <libusb.h>

namespace Push2Display
{
   struct Data
   {
      t_object ob; // the object itself (must be first)
      void* outlet1;

      libusb_context* context;
      libusb_device_handle* device;
      uint8_t* data;
   };
   Data* push2_display_class; // global class pointer variable

   void* create(t_symbol* s, long argc, t_atom* argv);
   void destroy(Data* x);

   void input1(Data* x, long intValue);
   void assist(Data* x, void* b, long m, long a, char* s);

   void transfer(Data* x);
} // namespace Push2Display

#endif // wa_push2_displayH
