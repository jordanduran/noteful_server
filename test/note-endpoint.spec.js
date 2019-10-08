const noteRouter = require('../src/note-functionality/note-router');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folder-fixtures');
const { makeNotesArrayForEndpoints } = require('./fixtures/note-fixtures');

describe.only(`FOLDER ENDPOINTS`, ()=>{
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

    describe(`Testing notes enpoints`, ()=>{

        context(`Given notes have no data`, ()=>{

            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            it(`GET /notes Returns empty array`, ()=>{
                return supertest(app)
                    .get('/notes')
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.eql([]);                        
                    });
            });

            it(`POST /notes - Adds a new note`,()=>{
                const newNote = {
                    note_name : 'Test Note',
                    content: 'Test Content',
                    folder_id: 1
                }
                return supertest(app)
                    .post('/notes')
                    .send(newNote)
                    .expect(201)
                    .then((res)=>{
                        expect(res.body.id).to.eql(1);
                        expect(res.body.note_name).to.eql(newNote.note_name);
                        expect(res.body.content).to.eql(newNote.content);
                        expect(res.body.folder_id).to.eql(newNote.folder_id);
                        const expected = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actual = new Date(res.body.date_modified).toLocaleString();
                        expect(expected).to.eql(actual);
                    });
            });
        });

        context(`Given notes have data`, ()=>{
            
            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            beforeEach(`Insert data into notes`, ()=>{
                return db(NOTES_TABLE)
                    .insert(testNotes);
            });

            it(`GET /notes - returns all notes in the table`, ()=>{
                return supertest(app)
                    .get(`/notes`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(testNotes);
                    })
            });

            it(`GET /notes/:id - returns the correct note`, ()=>{
                const id = 4;
                const expectedNote = testNotes[id-1];
                return supertest(app)
                    .get(`/notes/${id}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(expectedNote);
                    })
            });

            it(`DELETE /notes/:id - deletes the correct note`, ()=>{
                const id = 2;
                const expectedNotes = testNotes.filter(note => note.id !== id);
                return supertest(app)
                    .delete(`/notes/${id}`)
                    .expect(204)
                    .then((res) => {
                        return supertest(app)
                            .get('/notes')
                            .expect(200)
                            .then((res) => {
                                expect(res.body).to.deep.eql(expectedNotes);
                            })
                    })
            });
        });

    })
})
