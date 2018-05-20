var express = require('express');
var router = express.Router();
var userControllers = require('./controllers/userController');
var tripControllers = require('./controllers/tripController');
var loginRequired = require('../helper').loginRequired;
var chatController = require('./controllers/chatController');
var ideaController = require('./controllers/ideaController');


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
router.post('/post/chat/message/new', loginRequired, chatController.newChatMessage);
router.get('/get/chat/message', loginRequired, chatController.getChatMessage);
router.post('/post/idea/new', loginRequired, ideaController.newIdea);
router.get('/get/ideas', loginRequired, ideaController.getIdeas);

exports.apiRouter = router;