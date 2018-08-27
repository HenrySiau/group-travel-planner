var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var apiRouter = require('./api/routers').apiRouter;
var cors = require('cors');
var models = require('./models');
var SocketIo = require('socket.io');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const app = express();
const path = require('path');

app.use(function (req, res, next) {
    res.io = io;
    next();
});

// enable CORSS(Cross Origin Resource Sharing)
app.use(cors());

// enable public static files
app.use(express.static('public'));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use('/api', apiRouter);

app.post('/post/idea/new/test', upload.single('imageData'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body);
    console.log('fileName: ' + req.file.filename);
    console.log('original name: ' + req.file.originalname);
    return res.status(200).json({
        success: false,
        message: 'no tripId received'
    })
})


app.get('/*', function (req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// let counter = 'cccc';

// models.sequelize.sync({force:true});
models.sequelize.sync();
const server = app.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
    // counter = 8;
});
const io = SocketIo(server, { path: '/api/trip' });

const socketEvents = require('./socketEvents')(io);
const message = 'the message';
