const express = require('express');
const notesService = require('./note-service');
const noteRouter = express.Router();
const bodyParser = express.json();

noteRouter
    .route('/')
    .get((req,res,next)=>{
        const knexInstance = req.app.get('db');
        notesService.getAllNotes(knexInstance)
        .then(notes => res.json(notes))
        .catch(next)
    })
    .post(bodyParser, (req,res,next)=>{
        const knexInstance = req.app.get('db')
        const newNote = {
            note_name: req.body.note_name,
            content: req.body.content,
            folder_id: req.body.folder_id
        }
        notesService.addNote(knexInstance,newNote)
        .then(newNote => res.status(201).send(newNote))
        .catch(next)
    })

noteRouter
    .route('/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        const knexInstance = req.app.get('db');
        notesService.getNotesById(knexInstance, id)
            .then(note => {
                if(!note){
                    res
                        .status(404)
                        .json({
                            error: {
                                message: `Note with id:${id} cannot be found`
                            }
                        })
                }
                res.json(note)
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const { id } = req.params;
        const knexInstance = req.app.get('db');
        notesService.deleteNote(knexInstance, id)
            .then((note) => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    });
    
   
    

module.exports = noteRouter;