import express from 'express';
import models from '../models/models';
import mid from '../helper';
import csrf from 'csurf';
var csrfProtection = csrf({ cookie: true });

const router = express.Router();


router.get('/', (req, res) => {
    res.locals.messages = req.flash();
    res.render('index');
});

// New user registration
router.get('/newuser', csrfProtection, (req, res) => {
    res.locals.messages = req.flash();
    res.render('newUser', {
        userName: req.session.userName,
        title: 'New User',
        csrfToken: req.csrfToken()
    });
});
router.post('/newuser', csrfProtection, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.email &&
        req.body.userName &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        };
        //use schema.create to insert data into the db
        models.User.create(userData, function (err) {
            if (err) {
                // TODO add a flash to show warnning at the web page
                console.error('Can not create User name: ' + req.body.username);
                res.send(err);
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
router.get('/login', csrfProtection, (req, res) => {
    res.locals.messages = req.flash();
    res.render('login', {
        userName: req.session.userName,
        title: 'User Login',
        csrfToken: req.csrfToken()
    });
});
router.post('/login', csrfProtection, function (req, res) {
    if (req.body.email && req.body.password) {
        models.User.authenticate(req.body.email, req.body.password, function (err, user) {
            if (err || !user) {
                console.error('err:' + err);
                req.flash('msg', 'User name and password does not match');
                return res.redirect('/login');
            } else {
                req.session.userId = user._id;
                req.session.userName = user.userName;
                return res.redirect('/profile');
            }
        });
    }
});

router.get('/profile', mid.requiresLogin, (req, res) => {
    res.locals.messages = req.flash();
    res.render('profile', {
        userName: req.session.userName,
        title: 'Profile'
    });
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

// test
router.get('/test', (req, res) => {
    res.send(typeof (mid) + '----' + typeof (models.User));
});

export default router;