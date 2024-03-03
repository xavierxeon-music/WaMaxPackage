#ifndef wa_to7bit_H
#define wa_to7bit_H

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

namespace To7Bit
{
   struct Data
   {
      t_object ob; // the object itself (must be first)
      void* outlet1;
   };
   Data* to7bit_class; // global class pointer variable

   void* create(t_symbol* s, long argc, t_atom* argv);
   void destroy(Data* x);

   void input1(Data* x, long intValue);
   void assist(Data* x, void* b, long m, long a, char* s);
}; // namespace To7Bit

#endif // wa_to7bit_H
