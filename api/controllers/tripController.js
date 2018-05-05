var { User, Trip } = require('../../models');
var superSecret = require('../../config').superSecret;
var jwt = require('jsonwebtoken');
var config = require('../../config');
var config = require('../../config');
var instanceConfig = require('../../instanceConfig');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: instanceConfig.gmailAddress,
        pass: instanceConfig.gmailPassword
    }
});

const strip = (str) => {
    if (str) {
        return str.replace(/^\s+|\s+$/g, '');
    } else {
        return '';
    }
}

// generate random string
const generateRandomString = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// re-generate invitation code if it's been used
const generateInvitationCode = (resolve) => {
    console.log('generateInvitationCode');
    let code = generateRandomString(8);
    console.log('generateInvitationCode: ' + code);
    var query = Trip.findOne({ where: { invitationCode: code }, attributes: ['id'] });
    query.then((trip) => {
        if (trip) return generateInvitationCode(resolve);
        else {
            console.log('return code: ' + code);
            resolve(code)
        }

    });
}

const getInvitationCode = () => {
    return new Promise(resolve => {
        generateInvitationCode(resolve);
    })
}

exports.createTrip = async (req, res) => {
    if (req.body) {
        if (req.body.tripName &&
            req.body.startDate &&
            req.body.endDate) {
            let invitationCode;
            let user;
            await Promise.all([
                getInvitationCode(),
                User.findById(req.decodedJWT.userId)
            ])
                .then((results) => {
                    invitationCode = results[0];
                    user = results[1];
                })
                .catch(error => {
                    console.error(error);
                })
            const tripData = {
                title: strip(req.body.tripName),
                description: strip(req.body.description),
                invitationCode: invitationCode,
                ownerUserId: req.decodedJWT.userId,
                startDate: new Date(req.body.startDate).setHours(0, 0, 0, 0), // set to first second of the date
                endDate: new Date(req.body.endDate).setHours(23, 59, 59, 999), // set to last second of the date
            };
            console.log('user email: ' + user.email);
            Trip.create(tripData).then(async (newTrip) => {
                newTrip.addMember(user);
                newTrip.addAdmin(user);
                console.log('after add member');
                return res.status(200).json({
                    success: true,
                    tripInfo: {
                        tripId: newTrip.id,
                        title: newTrip.title,
                        description: newTrip.description,
                        startDate: newTrip.startDate,
                        endDate: newTrip.endDate,
                        invitationCode: newTrip.invitationCode
                    }
                });
            }).catch(error => {
                console.error(error);
                return res.status(200).json({
                    success: false,
                    error: err
                });
            })
        }
    }
}

