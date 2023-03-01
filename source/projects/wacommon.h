template <typename MaxClassType>
argument_function memFunc(MaxClassType* instance, void (MaxClassType::*functionPointer)(const atom&))
{
   return std::bind(functionPointer, instance, std::placeholders::_1);
}

template <typename MaxClassType>
function memFunc(MaxClassType* instance, atoms (MaxClassType::*functionPointer)(const atoms&, const int))
{
   return std::bind(functionPointer, instance, std::placeholders::_1, std::placeholders::_2);
}
