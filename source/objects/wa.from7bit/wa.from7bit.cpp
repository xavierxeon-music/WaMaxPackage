#include "wa.from7bit.h"

void from7bit_list(From7Bit *x, t_symbol *s, long argc, t_atom *argv)
{
   // post("float %.2f received in right inlet", f);
   if (proxy_getinlet((t_object *)x) == 0)
   {
      long number = 0;
      t_atom *ap = argv;
      long power = 1;
      for (char i = 0; i < argc; i++)
      {
         if (atom_gettype(ap) == A_LONG)
         {
            t_atom_long part = atom_getlong(ap);
            number += part * power;
         }
         power *= 128;
         ap++;
      }
      outlet_int(x->m_outlet1, number);
   }
}

void from7bit_assist(From7Bit *x, void *b, long m, long a, char *s)
{
   if (m == ASSIST_INLET)
   { // Inlets
      switch (a)
      {
      case 0:
         sprintf(s, "7 bit list");
         break;
      }
   }
   else
   { // Outlets
      switch (a)
      {
      case 0:
         sprintf(s, "int");
         break;
      }
   }
}

void *from7bit_new(t_symbol *s, long argc, t_atom *argv)
{
   From7Bit *x = (From7Bit *)object_alloc((t_class *)from7bit_class);

   // x->d_inletnum = 0;
   // x->d_proxy = proxy_new(x, 1, &x->d_inletnum);
   x->m_outlet1 = intout((t_object *)x);

   return x;
}

void from7bit_free(From7Bit *x)
{
   object_free(x->m_outlet1);
   // freeobject((t_object*)x->d_proxy);
}

void ext_main(void *r)
{
   t_class *c = class_new("wa.from7Bit", (method)from7bit_new, (method)from7bit_free, (long)sizeof(From7Bit), 0L, A_GIMME, 0);
   from7bit_class = (From7Bit *)c;

   // inlets
   class_addmethod(c, (method)from7bit_list, "list", A_GIMME, 0);

   // other
   class_addmethod(c, (method)from7bit_assist, "assist", A_CANT, 0);

   class_register(CLASS_BOX, c);
}
