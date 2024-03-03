#ifndef wa_from7bit_H
#define wa_from7bit_H

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

namespace From7Bit
{
   struct Data
   {
      t_object ob; // the object itself (must be first)
      void* m_outlet1;
   };
   Data* from7bit_class; // global class pointer variable

   void* create(t_symbol* s, long argc, t_atom* argv);
   void destroy(Data* x);

   void input1(Data* x, t_symbol* s, long argc, t_atom* argv);
   void assist(Data* x, void* b, long m, long a, char* s);

} // namespace From7Bit

#endif // wa_from7bit_H
