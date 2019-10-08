const folderRouter = require('../src/folder-functionality/folder-router');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folder-fixtures');
const { makeNotesArrayForEndpoints } = require('./fixtures/note-fixtures');

describe(`FOLDER ENDPOINTS`, ()=>{
    let db;
    const testFolders = makeFoldersArray();
    const testNotes = makeNotesArrayForEndpoints();
    const FOLDERS_TABLE = 'folders';
    const NOTES_TABLE = 'notes';

    before(`Create knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
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

    describe(`Testing folder enpoints`, ()=>{

        context(`Given folders and notes have no data`, ()=>{
            it(`GET /folders Returns empty array`, ()=>{
                return supertest(app)
                    .get('/folders')
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.eql([]);                        
                    });
            });
            it(`POST /folders - Adds a new folder`,()=>{
                const newFolder = {
                    title: 'Test Folder'
                }
                return supertest(app)
                    .post('/folders')
                    .send(newFolder)
                    .expect(201)
                    .then((res)=>{
                        expect(res.body).to.eql({
                            id: 1,
                            title: newFolder.title
                        });
                    })
            });
        });

        context(`Given folders has data and notes is empty`, ()=>{
            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            it(`GET /folders - returns all the folders`, ()=>{
                return supertest(app)
                    .get('/folders')
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(testFolders);                        
                    });
            });

            it(`GET /fodler/:id - return no notes as notes table is empty`, ()=>{
                const id = 1;
                return supertest(app)
                    .get(`/folders/${id}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.eql([]);
                    })
            });
        });

        context(`Given folders and notes have data`, ()=>{
            
            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            beforeEach(`Insert data into notes`, ()=>{
                return db(NOTES_TABLE)
                    .insert(testNotes);
            });

            it(`GET /folder/:id - returns all notes in the folder`, ()=>{
                const id = 1;
                const expectNotes = testNotes.filter(note => note.folder_id === id);
                return supertest(app)
                    .get(`/folders/${id}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(expectNotes);
                    })
            });
        });

    })
})