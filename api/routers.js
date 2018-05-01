var express = require('express');
var router = express.Router();
var userControllers = require('./controllers/userController');


// test
router.get('/test', (req, res) => {
    res.send('hello');
});

router.get('/user/add', userControllers.setUser);
router.get('/user', userControllers.getUsers);

exports.apiRouter = router;