import express from 'express';
import User from '../models/models';
import mid from '../helper';

const router = express.Router();

// // middleware that required a login
// function requiresLogin(req, res, next) {
//     if (req.session && req.session.userId) {
//       return next();
//     } else {
//       req.flash('msg', 'Please login first');
  
//       res.redirect('/login');
//     }
//   }

router.get('/', (req, res) => {
    res.render('index');
});

// New user registration
router.get('/newuser', (req, res) => {
    res.locals.messages = req.flash();
    res.render('newUser', {
        userName: req.session.userName,
        title: 'New User'
    });
});
router.post('/newuser', function (req, res) {
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
router.get('/login', (req, res) => {
    res.locals.messages = req.flash();
    res.render('login', {
        userName: req.session.userName,
        title: 'User Login'
    });
});
router.post('/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    req.body.userName = 'Henry';
    res.redirect('/');
});

router.get('/profile', mid.requiresLogin,(req, res) => {

    res.send('profile page');
});

// logout page
router.get('/logout', (req, res, next) => {
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

export default router;