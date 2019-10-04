const express = require('express');
const foldersService = require('./folder-service');

const folderRouter = express.Router();

folderRouter
    .route('/folders')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        foldersService.getAllFolders(knexInstance)
        .then(folders => {
            res.json(folders)
        })
        .catch(next);
    })







module.exports = folderRouter