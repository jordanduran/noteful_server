const NotesService = require('../src/note-functionality/note-service');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folder-fixtures');
const { makeNotesArray } = require('./fixtures/note-fixtures');

describe.only(`Notes Service`, ()=>{
    let db;
    const testFolders = makeFoldersArray();
    const testNotes = makeNotesArray();
    const FOLDERS_TABLE = 'folders';
    const NOTES_TABLE = 'notes';

    before(`Create knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db);
    });

    after(`Destroy the DB`, ()=>{
        return db.destroy();
    });

    beforeEach(`Clear the folder and notes table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    afterEach(`Clear notes and folders table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    context(`Given no notes in the table`, ()=>{
        
        it(`get all notes, return an empty array`, ()=>{
            return NotesService.getAllNotes(db)
            .then((notes)=>{
                expect(notes).to.eql([])
            })
        
        })
        beforeEach(`add folder`, ()=>{
            return db(FOLDERS_TABLE)
            .insert(testFolders)
        })
        it(`add new note`, ()=>{
            // this.retries(4);
            const newNote ={
                note_name: 'test note name',
                content: 'note note note',
                folder_id: 1
            }
            return NotesService.addNote(db, newNote)
                .then((actualNote) => {
                    console.log(testFolders)
                    expect(actualNote).to.eql({
                        id: 1,
                        note_name: newNote.note_name,
                        content: newNote.content,
                        date_modified: new Date(),
                        folder_id: newNote.folder_id
                    })
                })
        })
    
    })
})