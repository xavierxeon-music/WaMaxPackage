#ifndef WaObjectH
#define WaObjectH

#include "c74_min.h"

namespace Wa
{
   using Inlet = c74::min::inlet<>;
   using Outlet = c74::min::outlet<>;
   using Message = c74::min::message<>;

   using Symbol = c74::min::symbol;

   using SymbolArgument = c74::min::argument<Symbol>;

   using SymbolAttribute = c74::min::attribute<Symbol>;

   using Atom = c74::min::atom;
   using Atoms = c74::min::atoms;
   using Description = c74::min::description;

   template <typename MinClassType>
   class Object : public c74::min::object<MinClassType>
   {
   public:
   public:
      Object();

   public:
      c74::min::argument_function af(void (MinClassType::*functionPointer)(const Atom& arg)) const;
   };
} // namespace Wa

#ifndef WaObjectHPP
#include "WaObject.hpp"
#endif // NOT WaObjectHPP

#endif // NOT WaObjectH
