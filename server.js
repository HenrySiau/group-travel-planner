import config from './config';
import apiRouter from './api/api';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import User from './models/models';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

const server = express();

server.use(bodyParser.urlencoded({
    extended: false
}));

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
// server.use((req, res, next) => {
//     // Pass the flash prototype; the templates will use it to get the messages
//     res.locals.flash = req.flash;
//     next();
//     });

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

server.set('view engine', 'ejs');

// middleware that required a login
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        req.flash('msg', 'Please login first');
        
        res.redirect('/login');
    }
}

// main page
server.get('/', (req, res) => {
    res.render('index');
});

// New user registration
server.get('/newuser', (req, res) => {
    res.locals.messages = req.flash();
    res.render('newUser', {
        userName: req.session.userName,
        title: 'New User'
    });
});
server.post('/newuser', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        };
        //use schema.create to insert data into the db
        User.create(userData, function (err) {
            if (err) {
                // TODO add a flash to show warnning at the web page
                console.error('Can not create User name: ' + req.body.username);
                res.send('userName: ' + req.body.userName);
            } else {
                return res.send('added user');
            }
        });

    } else {
        // user registration form missing information
        res.redirect('/newuser');
    }

});

// Login page
server.get('/login', (req, res) => {
    res.locals.messages = req.flash();
    res.render('login', {
        userName: req.session.userName,
        title: 'User Login'
    });
});
server.post('/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    req.body.userName = 'Henry';
    res.redirect('/');
});

// logout page
server.get('/logout', (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});

server.get('/profile', requiresLogin, (req, res) => {
    res.send('profile page');
});

server.use('/api', apiRouter);

server.use(express.static('public'));

server.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
});