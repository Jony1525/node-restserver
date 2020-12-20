require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const log4js = require('log4js');
var bodyParser = require('body-parser');


log4js.configure({
    appenders: { server: { type: "file", filename: "../server.log" } },
    categories: { default: { appenders: ['server'], level: 'info' },
                    info: { appenders: ['server'], level: 'error' },
                    warning: { appenders: ['server'], level: 'warn'} }
});


const logger = log4js.getLogger('cheese');
logger.info('Se ha iniciado la aplicación');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
                (err, res) => {
    if ( err ) throw err;
    console.log('Base de datos ONLINE');
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});