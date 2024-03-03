#include "wa.to7bit.h"

void* To7Bit::create(t_symbol* s, long argc, t_atom* argv)
{
   Data* x = (Data*)object_alloc((t_class*)to7bit_class);
   x->outlet1 = listout((t_object*)x);

   return x;
}

void To7Bit::destroy(Data* x)
{
   object_free(x->outlet1);
}

void To7Bit::input1(Data* x, long intValue)
{
   if (intValue < 0)
      return;

   if (proxy_getinlet((t_object*)x) == 0)
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

      outlet_list(x->outlet1, 0L, maxIndex, myList);
   }
}

void To7Bit::assist(Data* x, void* b, long m, long a, char* s)
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

// main function

void ext_main(void* r)
{
   t_class* c = class_new("wa.to7bit", (method)To7Bit::create, (method)To7Bit::destroy, (long)sizeof(To7Bit::Data), 0L, A_GIMME, 0);

   // inlets
   class_addmethod(c, (method)To7Bit::input1, "int", A_LONG, 0);

   // other
   class_addmethod(c, (method)To7Bit::assist, "assist", A_CANT, 0);

   class_register(CLASS_BOX, c);
   To7Bit::to7bit_class = (To7Bit::Data*)c;
}
