#include "wa.push2_display.h"

#include <vector>

#include "jit.common.h"
#include "max.jit.mop.h"

// see https://github.com/pixsperdavid/imp.push/blob/master/src/imp.push.c

void* Push2Display::create(t_symbol* s, long argc, t_atom* argv)
{
   Data* x = (Data*)max_jit_object_alloc((t_class*)push2_display_class, gensym("push2_display"));

   void* o = jit_object_new(gensym("push2_display"));
   if (o)
   {
      max_jit_mop_setup_simple(x, o, argc, argv);
      max_jit_attr_args(x, argc, argv);

      x->server_name = jit_symbol_unique();
      jit_object_method(o, _jit_sym_register, x->server_name);
      jit_object_attach(x->server_name, x);
   }
   else
   {
      object_free((t_object*)x);
      x = nullptr;
   }

   x->outlet1 = listout((t_object*)x);

   libusb_init(&x->context);
   // keep transfering buffer to avoid automatic screen blank
   //timerId = startTimer(1000);

   return x;
}

void Push2Display::destroy(Data* x)
{
   if (x->device)
   {
      libusb_release_interface(x->device, 0);
      libusb_close(x->device);
   }

   if (x->context)
      libusb_exit(x->context);

   object_free(x->outlet1);
}

void Push2Display::input1(Data* x, long intValue)
{
   if (intValue < 0)
      return;

   if (proxy_getinlet((t_object*)x) == 0)
   {
      static const char maxSize = sizeof(long);
      t_atom myList[maxSize];

      std::vector<uint8_t> sevenBits;

      int maxValue = 1;
      for (char i = 0; i < maxSize; i++)
      {
         if (intValue < maxValue)
            continue;

         long value = intValue >> (7 * i);
         value = value & 127;
         maxValue *= 128;
         sevenBits.insert(sevenBits.begin(), value);

         atom_setlong(myList + i, value);
      }

      for (char i = 0; i < sevenBits.size(); i++)
      {
         atom_setlong(myList + i, sevenBits[i]);
      }

      outlet_list(x->outlet1, 0L, sevenBits.size(), myList);
   }
}

void Push2Display::input_notify(Data* x, t_symbol* s, t_symbol* msg, void* ob, void* data)
{
   if (msg == _sym_attr_modified)
   {
      t_jit_attr* attribute = (t_jit_attr*)data;
      t_jit_object* jitobj = (t_jit_object*)max_jit_obex_jitob_get(x);
      t_atom_long status = jit_attr_getlong(jitobj, attribute->name);

      t_atom av[1];
      jit_atom_setlong(av, status);

      max_jit_obex_dumpout(x, attribute->name, 1, av);
   }
   else
   {
      max_jit_mop_notify(x, s, msg);
   }
}

void Push2Display::assist(Data* x, void* b, long m, long a, char* s)
{
   if (m == ASSIST_INLET)
   { // Inlets
      switch (a)
      {
         case 0:
            sprintf(s, "int");
            break;
      }
   }
   else
   { // Outlets
      switch (a)
      {
         case 0:
            sprintf(s, "7 bit list");
            break;
      }
   }
}

void Push2Display::transfer(Data* x)
{
   if (!x->device)
   {
      x->device = libusb_open_device_with_vid_pid(x->context, 0x2982, 0x1967);
      if (!x->device)
         return;

      libusb_claim_interface(x->device, 0);
      //slotResetDisplay();
   }

   static uint8_t header[] = {0xEF, 0xCD, 0xAB, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
   static const uint8_t endpoint = 0x01 | LIBUSB_ENDPOINT_OUT;
   static const uint timeout = 1000;
   static const int dataLength = 20 * 16384;

   int transferred = 0;

   // header
   libusb_bulk_transfer(x->device, endpoint, header, sizeof(header), &transferred, timeout);

   // data
   //uint8_t* data = const_cast<uint8_t*>(buffer.bits());
   libusb_bulk_transfer(x->device, endpoint, x->data, dataLength, &transferred, timeout);

   // device no longer available
   if (0 == transferred)
   {
      libusb_release_interface(x->device, 0);
      libusb_close(x->device);
      x->device = nullptr;
   }
}

// main function

void ext_main(void* r)
{
   t_class* c = class_new("wa.push2_display", (method)Push2Display::create, (method)Push2Display::destroy, (long)sizeof(Push2Display::Data), 0L, A_GIMME, 0);

   // jit

   max_jit_class_obex_setup(c, calcoffset(Push2Display::Data, obex));
   t_class* jitclass = (t_class*)jit_class_findbyname(gensym("push2_display"));
   max_jit_class_mop_wrap(c, jitclass, MAX_JIT_MOP_FLAGS_OWN_ADAPT | MAX_JIT_MOP_FLAGS_OWN_OUTPUTMODE | MAX_JIT_MOP_FLAGS_OWN_NOTIFY);
   max_jit_class_wrap_standard(c, jitclass, 0);

   // inlets
   //class_addmethod(c, (method)Push2Display::input1, "int", A_LONG, 0);
   class_addmethod(c, (method)Push2Display::input_notify, "notify", A_CANT, 0);

   // other
   class_addmethod(c, (method)Push2Display::assist, "assist", A_CANT, 0);

   class_register(CLASS_BOX, c);
   Push2Display::push2_display_class = (Push2Display::Data*)c;
}
