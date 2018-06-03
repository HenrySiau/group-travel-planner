var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');
var tripController = require('./controllers/tripController');
var loginRequired = require('../helper').loginRequired;
var chatController = require('./controllers/chatController');
var ideaController = require('./controllers/ideaController');
var multer = require("multer");
const uuidv4 = require('uuid/v4');
const settings = require('../config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, settings.imageUploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4());
    }
});
var upload = multer({
    storage: storage,
    limits: { fileSize: 20971520 } // Max file size: 20MB
});

router.get('/test', (req, res) => {
    res.send('hello');
});
router.post('/post/user/register', userController.register);
router.get('/user/add', userController.setUser);
router.get('/user', userController.getUsers);
router.post('/post/email/exist', userController.validateEmailExist);
router.post('/post/login/token', userController.loginWithToken);
router.post('/post/trip/new', loginRequired, tripController.createTrip);
router.post('/post/login/facebook', userController.LoginWithFacebook);
router.post('/post/invitation/code/verify', tripController.verifyInvitationCode);
router.post('/post/signin', userController.signIn);
router.post('/post/trip/join', loginRequired, tripController.addMemberToTrip);
router.post('/post/members/invite', loginRequired, tripController.inviteMembers);
router.post('/post/chat/message/new', loginRequired, chatController.newChatMessage);
router.get('/get/chat/message', loginRequired, chatController.getChatMessage);
router.post('/post/idea/new', loginRequired, upload.single('imageData'), ideaController.newIdea);
router.post('/post/avatar/update', loginRequired, upload.single('imageData'), userController.updateAvatar);
router.get('/get/ideas', loginRequired, ideaController.getIdeas);

exports.apiRouter = router;