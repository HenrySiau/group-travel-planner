var { User, Trip, Message } = require('../../models');
var superSecret = require('../../config').superSecret;
var jwt = require('jsonwebtoken');
var config = require('../../config');

exports.newChatMessage = (req, res) => {
    console.log(req.body);
    // TODO authorization decodedJWT userId
    if (req.body.message) {
        Message.create(req.body.message).then(newMessage => {
            res.io.to(req.body.message.tripId).emit('new message', newMessage);
            return res.status(200).json({
                success: true,
            })
        })
            .catch(error => {
                console.error(error);
            });
    } else {
        return res.status(200).json({
            success: false,
            message: 'no message received'
        })
    }
}

exports.getChatMessage = (req, res) => {
    // TODO authorization
    if (req.query.tripId) {
        Message.findAll({ where: { tripId: req.query.tripId }, limit: 100 }).then(messages => {
            console.log(messages)
            return res.status(200).json({
                success: false,
                messages: messages
            })
        }).catch(error => {
            console.error(error);
        })
    } else {
        return res.status(200).json({
            success: false,
            message: 'no tripId received'
        })
    }

}