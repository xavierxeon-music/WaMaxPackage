#ifndef wa_to7bit_H
#define wa_to7bit_H

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

////////////////////////// object struct
struct To7Bit
{
   t_object ob; // the object itself (must be first)
   void *m_outlet1;
   // long d_inletnum;
   // void* d_proxy;
};

//////////////////////// global class pointer variable
To7Bit *to7bit_class;

void *to7bit_new(t_symbol *s, long argc, t_atom *argv);
void to7bit_free(To7Bit *x);

void to7bit_int(To7Bit *x, long intValue);
void to7bit_assist(To7Bit *x, void *b, long m, long a, char *s);

#endif // wa_to7bit_H
