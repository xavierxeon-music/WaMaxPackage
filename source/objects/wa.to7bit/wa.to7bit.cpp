#include "wa.to7bit.h"

void to7bit_int(To7Bit *x, long intValue)
{
   if (intValue < 0)
      return;
   // post("float %.2f received in right inlet", f);
   if (proxy_getinlet((t_object *)x) == 0)
   {
      static const char maxSize = sizeof(long);
      t_atom myList[maxSize];

      char maxIndex = 0;
      int maxValue = 1;
      for (char i = 0; i < maxSize; i++)
      {
         if (intValue < maxValue)
            continue;

         long value = intValue >> (7 * i);
         value = value & 127;
         maxValue *= 128;

         atom_setlong(myList + i, value);
         maxIndex++;
      }

      outlet_list(x->m_outlet1, 0L, maxIndex, myList);
   }
}

void to7bit_assist(To7Bit *x, void *b, long m, long a, char *s)
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

void *to7bit_new(t_symbol *s, long argc, t_atom *argv)
{
   To7Bit *x = (To7Bit *)object_alloc((t_class *)to7bit_class);

   // x->d_inletnum = 0;
   // x->d_proxy = proxy_new(x, 1, &x->d_inletnum);
   x->m_outlet1 = listout((t_object *)x);

   return x;
}

void to7bit_free(To7Bit *x)
{
   object_free(x->m_outlet1);
   // freeobject((t_object*)x->d_proxy);
}

void ext_main(void *r)
{
   t_class *c = class_new("wa.to7bit", (method)to7bit_new, (method)to7bit_free, (long)sizeof(To7Bit), 0L, A_GIMME, 0);
   to7bit_class = (To7Bit *)c;

   // inlets
   class_addmethod(c, (method)to7bit_int, "int", A_LONG, 0);

   // other
   class_addmethod(c, (method)to7bit_assist, "assist", A_CANT, 0);

   class_register(CLASS_BOX, c);
}
