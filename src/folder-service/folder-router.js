const express = require('express');
const foldersService = require('./folder-service');
const bodyParser = express.json();
const folderRouter = express.Router();

folderRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        foldersService.getAllFolders(knexInstance)
        .then(folders => {
            res.json(folders)
        })
        .catch(next);

    })
    .post(bodyParser, (req,res,next) =>{
        const newFolder = {
            title: req.body.title
        }
        const knexInstance = req.app.get('db')
        foldersService.addNewFolder(knexInstance,newFolder)
        .then(newFolder => {
            
            res.status(201).send(newFolder)
        })
        .catch(next)
    })







module.exports = folderRouter;
