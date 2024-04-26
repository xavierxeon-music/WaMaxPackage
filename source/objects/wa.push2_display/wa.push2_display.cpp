#include "wa.push2_display.h"

#include "../common.h"

push2_display::push2_display()
   : input{this, "(matrix) Input", "matrix"}
   , output{this, "(matrix) Output", "matrix"}
{
}

template <typename matrix_type>
matrix_type push2_display::calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position)
{
   matrix_type output;
   double fmin = 0;
   double fmax = 1;

   for (auto plane = 0; plane < info.plane_count(); ++plane)
   {
      auto dummy = input[plane];
      output[plane] = clamp<decltype(dummy)>(input[plane], static_cast<decltype(dummy)>(fmin), static_cast<decltype(dummy)>(fmax));
   }
   return output;
}

pixel push2_display::calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
{
   pixel output;

   output[alpha] = clamp(input[alpha], cmin, cmax);
   output[red] = clamp(input[red], cmin, cmax);
   output[green] = clamp(input[green], cmin, cmax);
   output[blue] = clamp(input[blue], cmin, cmax);

   return output;
}

MIN_EXTERNAL(push2_display);