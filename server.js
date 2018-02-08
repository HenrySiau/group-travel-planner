import config from './config';
import apiRouter from './api/api';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';

const server = express();
server.set('trust proxy', 1); // trust first proxy
server.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect('mongodb://localhost/test', options).then(
  () => {
    console.info('mongoose.connect ready to use');
  },
  err => {
    /** handle initial connection error */
    console.error('mongoose.connect failed', err);
  }
);

server.set('view engine', 'ejs');



server.get('/', (req, res) => {
  res.render('index');
});

server.get('/newuser', (req, res) => {
  res.render('newUser');
});

server.get('/setsession', (req, res) => {
  req.session.userName = 'Henry';
  res.send('setsession');
});

server.get('/getsession', (req, res) => {
  res.render('session', {userName: req.session.userName});
});

server.use('/api', apiRouter);

server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});