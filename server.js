import config from './config';
import apiRouter from './api/api';
import express from 'express';
const server = express();

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