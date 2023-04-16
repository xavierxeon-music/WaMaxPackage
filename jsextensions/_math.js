// math

function powerOfTwo(value) {

   var power = 0;
   var test = 1;

   while (test < value) {
      test *= 2;
      power += 1;
   }

   if (test === value)
      return power;
   else
      return -1;
}
