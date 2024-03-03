#ifndef wa_from7bit_H
#define wa_from7bit_H

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

////////////////////////// object struct
struct From7Bit
{
   t_object ob; // the object itself (must be first)
   void *m_outlet1;
   // long d_inletnum;
   // void* d_proxy;
};

//////////////////////// global class pointer variable
From7Bit *from7bit_class;

void *from7bit_new(t_symbol *s, long argc, t_atom *argv);
void from7bit_free(From7Bit *x);

void from7bit_list(From7Bit *x, t_symbol *s, long argc, t_atom *argv);
void from7bit_assist(From7Bit *x, void *b, long m, long a, char *s);

#endif // wa_from7bit_H
