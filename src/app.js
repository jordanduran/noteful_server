require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const folderRouter = require('./folder-functionality/folder-router');
const noteRouter = require('./note-functionality/note-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    // const db = req.app.get('db');
    // db.table('folders').first('id', 'name').then(function(row) { console.log(row); });
    res.send('Hello, world!')
})

app.use('/folders', folderRouter);
app.use('/notes',noteRouter);

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app