import config from './config';
import apiRouter from './routers/api';
import router from './routers/router';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

const server = express();

server.use(bodyParser.urlencoded({
    extended: false
}));

// Flash message setting
server.set('trust proxy', 1); // trust first proxy
server.use(cookieParser('cp-gtplanner-secret'));
server.use(session({
    secret: 'gtp work hard',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));
server.use(flash());

// Database Connection config
const mongooseOptions = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
mongoose.connect('mongodb://localhost/test', mongooseOptions).then(
    () => {
        console.info('mongoose.connect ready to use');
    },
    err => {
        /** handle initial connection error */
        console.error('mongoose.connect failed', err);
    }
);
var db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // connected to Mongo
});

server.set('view engine', 'ejs');

// Register Routers
server.use('/api', apiRouter);
server.use('/', router);
server.use(express.static('public'));

server.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
});