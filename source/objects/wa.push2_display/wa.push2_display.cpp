
#include "c74_min.h"

using namespace c74::min;

class push2_display : public object<push2_display>, public matrix_operator<>
{
public:
   MIN_DESCRIPTION{"Limit matrix values to a range. The range is specified the object's min and max attributes."};

   inlet<> input{this, "(matrix) Input", "matrix"};
   outlet<> output{this, "(matrix) Output", "matrix"};

   // This object process each cell independently
   // So we define "calc_cell" instead of "calc_matrix"

   template <typename matrix_type>
   matrix_type calc_cell(matrix_type input, const matrix_info& info, matrix_coord& position)
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

   // We override the case for the char type to use the cached attribute values in the 0-255 range

   pixel calc_cell(pixel input, const matrix_info& info, matrix_coord& position)
   {
      pixel output;

      output[alpha] = clamp(input[alpha], cmin, cmax);
      output[red] = clamp(input[red], cmin, cmax);
      output[green] = clamp(input[green], cmin, cmax);
      output[blue] = clamp(input[blue], cmin, cmax);

      return output;
   }

private:
   uchar cmin;
   uchar cmax;
};

MIN_EXTERNAL(push2_display);