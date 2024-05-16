// see https://apple.stackexchange.com/questions/56561/how-do-i-find-the-windowid-to-pass-to-screencapture-l'


/*

connect iPad
start QuickTime PLayer
start Movie Recording
select iPad as Source (drop down next to Record button)
use screencapture -l$(osascript -e 'tell app "QuickTime Player" to id of window 1') test.png


*/