const NotesService = require('../src/note-functionality/note-service');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folder-fixtures');
const { makeNotesArray } = require('./fixtures/note-fixtures');

describe(`Notes Service`, ()=>{
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
            const newNote ={
                note_name: 'test note name',
                content: 'note note note',
                date_modified: new Date(),
                folder_id: 1
            }
            return NotesService.addNote(db, newNote)
                .then((actualNote) => {
                    expect(actualNote).to.eql({
                        id: 1,
                        note_name: newNote.note_name,
                        content: newNote.content,
                        date_modified: newNote.date_modified,
                        folder_id: newNote.folder_id
                    })
                })
        })
    });

    context(`Given there is data in notes and folders table`, ()=>{
        
        beforeEach(`Insert data into folders`, ()=>{
            return db(FOLDERS_TABLE)
                .insert(testFolders);
        })

        beforeEach(`Insert data into notes`, ()=>{
            return db(NOTES_TABLE)
                .insert(testNotes);
        })

        it(`getAllNotes() - return all notes in the table`, ()=>{
            return NotesService.getAllNotes(db)
                .then((notes) => {
                    expect(notes).to.deep.eql(testNotes);
                });
        });

        it(`getNoteById() - returns the correct note`, ()=>{
            const id = 1;
            const expectedNote = testNotes[id-1];
            return NotesService.getNotesById(db, id)
                .then((actualNote) => {
                    expect(actualNote).to.deep.eql(expectedNote);
                })
        });

        it(`deleteNote() - deletes the correct note`, ()=>{
            const id = 3;
            const expectedNotes = testNotes.filter((note) => note.id !== id)
            return NotesService.deleteNote(db, id)
                .then((res) => {
                    return NotesService.getAllNotes(db)
                        .then((actualNotes) => {
                            expect(expectedNotes).to.deep.eql(actualNotes);
                        });
                })
        });
    })
})