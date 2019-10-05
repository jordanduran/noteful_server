const FolderService = require('../src/folder-functionality/folder-service');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folder-fixtures');
const { makeNotesArray } = require('./fixtures/note-fixtures');

describe(`FOLDERS SERVICE TEST`, ()=>{
    
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

    context(`Given no folders in the table`, ()=>{

        it(`Returns an empty folder array`, ()=>{
            return FolderService.getAllFolders(db)
                .then((folders) => {
                    expect(folders).to.eql([]);
                })
        });

        it(`Return no notes on an non existent folder`, ()=>{
            const id = 12454;
            return FolderService.getAllNotesByFolderId(db, id)
                .then((notes) => {
                    expect(notes).to.eql([]);
                })
        });
        it(`Add new folder`, ()=>{
            const newFolder = {
                title: 'Test Folder'
            }
            return FolderService.addNewFolder(db,newFolder)
            .then((actualFolder) => {
                expect(actualFolder).to.eql({id:1, title: newFolder.title})
            })
        })

    })
    

    context(`Given there is data in the folders table`, () => {
        beforeEach(`Inserting data into folders`, () => {
            return db(FOLDERS_TABLE)
                .insert(testFolders);
        })
        it(` getAllFolders() Returns a folder array`, () => {
            return FolderService.getAllFolders(db)
                .then((folders) => {
                    expect(folders).to.deep.eql(testFolders);
                })
        })
        it(`getAllNotesByFolderId when there are no notes in a folder return empty array`, () =>{
            const id = 1;
            return FolderService.getAllNotesByFolderId(db, id)
                .then((notes) => {
                    expect(notes).to.eql([])
                })
        })
    })
    context(`Folders and Notes both have data`, ()=>{
        beforeEach(`Insert data into folders`, ()=>{
            return db(FOLDERS_TABLE)
                .insert(testFolders);
        })
        beforeEach(`Insert data into notes`, ()=>{
            return db(NOTES_TABLE)
                .insert(testNotes);
        })
        it(`Get all notes by folder id`, ()=>{
            const id = 1;
            const expectedNotesArr = testNotes.filter(note => note.folder_id === id)
            return FolderService.getAllNotesByFolderId(db, id)
                .then((notes)=>{
                    expect(notes).to.eql(expectedNotesArr)
                    
                })
        })
    })

});