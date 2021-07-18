const express = require('express');
const fs = require("fs")
const path = require('path');
const Data = require("./db/data");
const notesBase = require ("./db/db.json");


const newdata = new Data();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


// Main page => getiing index.html and send it back to client
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Note page => getiing notes.html and send it back to client
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// notes => getting db.json and send it back to client
app.get('/api/notes/', (req, res) => res.json(newdata.allNotes()));
// showing saved notes for click

// new notes -> clients saves it => db.json changed => server gets it, then send it back to client
app.post('/api/notes', (req, res) => {
  let newnotes = req.body;
  let originNum = 0;
  for (let i = 0; i < notesBase.length; i++) {
      let aNote = notesBase[i];
      if (aNote.id > originNum) {
          originNum = aNote.id;
      }
  }
  newnotes.id = originNum + 1;
  notesBase.push(newnotes)  
  newdata.addNote(newnotes).then( () => {    
    res.json(newnotes);
    })
    console.log(`The notes ${newnotes.title} has been saved!`);
    console.log(newnotes);
    console.log("Please check whether the new data is wrong or not");
})
    

app.delete("/api/notes/:id", function(req, res) {
  let noteId = req.params.id.toString();
  console.log(noteId);
  console.log(`DELETE note request for noteId: ${noteId}`);    
  let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newData = data.filter( note => note.id.toString() !== noteId );
  fs.writeFileSync('./db/db.json', JSON.stringify(newData));
  console.log(`Successfully deleted note with id : ${noteId}`);
  res.json(newdata.loadNotes())
  });

  
  // res.json(newdata.allNotes());


newdata.loadNotes().then( () => {
  app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
})
