import config from './config';
import apiRouter from './api/api';
import express from 'express';
const server = express();
import mongoose from 'mongoose';

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect('mongodb://localhost/test',options).then(
  () => { console.info('mongoose.connect ready to use'); },
  err => { 
    /** handle initial connection error */ 
    console.error('mongoose.connect failed', err);
  }
);

server.set('view engine', 'ejs');

// server.get('/', (req, res) => {
//   res.render('index', {
//     content: '...'
//   });
// });



server.get('/', (req, res) => {
  res.render('index');
});

server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});