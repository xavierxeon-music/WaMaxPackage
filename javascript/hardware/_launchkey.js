var InputType = {
   Blank: 0,
   ColorButton: 1,
   GrayButton: 2,
   Pot: 3,
   Fader: 4
};

function typeFromString(text) {

   if ("ColorButton" == text)
      return InputType.ColorButton;
   else if ("GrayButton" == text)
      return InputType.GrayButton;
   else if ("Pot" == text)
      return InputType.Pot;
   else if ("Fader" == text)
      return InputType.Fader;
   else
      return InputType.Blank;
}

function compileKey(value) {

   var text = value.toString();
   if (value < 10)
      text = "0" + text;

   return text;
}


