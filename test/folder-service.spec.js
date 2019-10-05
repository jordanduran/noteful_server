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

    before(`Clear the folder and notes table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders CASCADE`);
    });

    afterEach(`Clear notes and folders table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders CASCADE`);
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

    })
    

});