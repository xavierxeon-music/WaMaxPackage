var InputType = {
   Blank: 0,
   Button: 1,
   Pot: 2,
   Fader: 3
};

function typeFromString(text) {

   if ("Button" == text)
      return InputType.Button;
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


