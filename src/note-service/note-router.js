const express = require('express');
const notesService = require('./note-service');

noteRouter
    .route('/')
    .get((req,res,next)=>{
        const knexInstance = req.app.get('db');
        notesService.getAllNotes(knexInstance)
        .then(notes => res.json(notes))
    })
    .catch(next)


module.exports = noteRouter;