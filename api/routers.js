var express = require('express');
var router = express.Router();
var userControllers = require('./controllers/userController');


// test
router.get('/test', (req, res) => {
    res.send('hello');
});
router.post('/post/user/register', userControllers.register);
router.get('/user/add', userControllers.setUser);
router.get('/user', userControllers.getUsers);
router.post('/post/email/exist', userControllers.validateEmailExist);


exports.apiRouter = router;