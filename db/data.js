const fs = require("fs").promises;
const path = require("path");
const notesBase = require ("./db.json");
const notesJsonPath = path.join(__dirname, "./db.json");

class Data {
  constructor() {
    this.notes = [];
  }

  loadNotes() {
    return fs.readFile(notesJsonPath, "utf-8").then((data) => {
      this.notes = JSON.parse(data);
    });
  }

  addNote(note) {
    this.notes.push(note);
    return fs.writeFile(notesJsonPath, JSON.stringify(this.notes));
  }

  allNotes() {
    return this.notes;
  } 
    // let i = 0, i< this.notes.length
    // get the note of index of i
    // if note id = id,
    // then we need to delete the note at that index
    // after deleting, we need to save the notes. back to the data json file.
}

module.exports = Data;
