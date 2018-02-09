import config from './config';
import apiRouter from './api/api';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));

server.set('trust proxy', 1); // trust first proxy
server.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  }
}));

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


// main page
server.get('/', (req, res) => {
  res.render('index');
});

// New user registration
server.get('/newuser', (req, res) => {
  res.render('newUser', {
    userName: req.session.userName,
    title: 'New User'
  });
});
server.post('/newuser', function (req, res) {
  if (!req.body) return res.sendStatus(400);
  
  res.send('userName: ' + req.body.userName);
});

// Login page
server.get('/login', (req, res) => {
  res.render('login', {
    userName: req.session.userName,
    title: 'User Login'
  });
});

// logout page
server.get('/logout', (req, res) => {
  req.session.userName = undefined;
  // res.render('login', {
  //   userName: req.session.userName,
  //   title: 'Login'
  // });
  res.redirect('/login');
});

server.use('/api', apiRouter);

server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});