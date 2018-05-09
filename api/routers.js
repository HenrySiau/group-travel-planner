var express = require('express');
var router = express.Router();
var userControllers = require('./controllers/userController');
var tripControllers = require('./controllers/tripController');
var loginRequired = require('../helper').loginRequired;


// test
router.get('/test', (req, res) => {
    res.send('hello');
});
router.post('/post/user/register', userControllers.register);
router.get('/user/add', userControllers.setUser);
router.get('/user', userControllers.getUsers);
router.post('/post/email/exist', userControllers.validateEmailExist);
router.post('/post/login/token', userControllers.loginWithToken);
router.post('/post/trip/new', loginRequired, tripControllers.createTrip);
router.post('/post/login/facebook', userControllers.LoginWithFacebook);
router.post('/post/invitation/code/verify', tripControllers.verifyInvitationCode);
router.post('/post/signin', userControllers.signIn);
router.post('/post/trip/join', loginRequired, tripControllers.addMemberToTrip);
router.post('/post/members/invite', loginRequired, tripControllers.inviteMembers);

exports.apiRouter = router;