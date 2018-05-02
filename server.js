var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var apiRouter = require('./api/routers').apiRouter;
var cors = require('cors');
var models = require('./models');

const server = express();

// enable CORSS(Cross Origin Resource Sharing)
server.use(cors());

// enable public static files
server.use(express.static('public'));

// use body parser so we can get info from POST and/or URL parameters
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// use morgan to log requests to the console
server.use(morgan('dev'));

server.use('/api', apiRouter);

// models.sequelize.sync({force: true}).then(() => {
models.sequelize.sync().then(() => {
    server.listen(config.port, config.host, () => {
        console.info('Express listening on port', config.port);
    });
})
