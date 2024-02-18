//

var numberOfColumns = 10;



const messageBuffer = new RingBuffer(numberOfColumns, [".", ""]);
const tableElements = new Array(length).fill(undefined);

function updateTable() {

   for (let index = 0; index < numberOfColumns; index++) {

      let content = messageBuffer.get(index);
      let rows = tableElements[index];

      rows[0].innerHTML = content[0];
      rows[1].innerHTML = content[1];
   }
}

max.bindInlet('addMessage', addMessage);
function addMessage(text) {

   const now = new Date();
   let hh = now.getHours().toString();
   if (hh.length < 2)
      hh = "0" + hh;
   let mm = now.getMinutes().toString();
   if (mm.length < 2)
      mm = "0" + mm;
   let ss = now.getSeconds().toString();
   if (ss.length < 2)
      ss = "0" + ss;

   let time = hh + ":" + mm + ":" + ss;
   messageBuffer.push([time, text]);
   updateTable();
}

max.bindInlet('clearMessages', clearMessages);
function clearMessages() {

   for (let index = 0; index < numberOfColumns; index++)
      messageBuffer.push([".", ""]);

   updateTable();
}


// gui
setupDocument(250, 1, 1);
let table = new Table(undefined, ["time", "message"], ["60px", "auto"]);


for (let index = 0; index < numberOfColumns; index++) {
   let rows = table.addRow(["", ""]);
   tableElements[numberOfColumns - (1 + index)] = rows;
}

createTitle("console");

updateTable();
