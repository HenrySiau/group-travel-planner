var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var apiRouter = require('./api/routers').apiRouter;
var cors = require('cors');
var models = require('./models');
var SocketIo = require('socket.io');

const app = express();

app.use(function (req, res, next) {
    res.io = io;
    next();
});

// enable CORSS(Cross Origin Resource Sharing)
app.use(cors());

// enable public static files
app.use(express.static('public'));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use('/api', apiRouter);

let counter = 'cccc';

// models.sequelize.sync({force:true});
models.sequelize.sync();
const server = app.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
    counter = 8;
});
const io = SocketIo(server, { path: '/api/trip' });

const socketEvents = require('./socketEvents')(io);
const message = 'the message';
