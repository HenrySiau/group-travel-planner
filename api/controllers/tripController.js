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
                await newTrip.addMember(user);
                // if(newTrip.hasMember(user)){
                //     console.log('newTrip has user');
                // }else{
                //     console.log('newTrip does not has user');
                // }
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

exports.verifyInvitationCode = async (req, res) => {
    console.log(req.body);
    let tripInfo;
    let userInfo;
    if (req.body.invitationCode) {
        await Trip.findOne({ where: { invitationCode: req.body.invitationCode } })
            .then(trip => {
                if (trip) {
                    console.log('found the trip title: ' + trip.title);
                    tripInfo = {
                        tripId: trip.id,
                        title: trip.title,
                        invitationCode: trip.invitationCode
                    }
                } else {
                    return res.status(200).json({
                        success: false,
                        message: 'Invalid invitation code'
                    });
                }
            }).catch(error => {
                console.error(error);
            })
        if (req.body.token) {
            jwt.verify(req.body.token, superSecret, function (err, decoded) {
                if (err) {
                    console.err(err);
                }
                if (decoded.iat && decoded.userId) {
                    console.log('decoded: ' + decoded);
                    if (decoded.iat > Date.now()) {
                        User.findById(decoded.userId).then(user => {
                            if (user) {
                                console.log('found user: ' + user.userName);
                                userInfo = {
                                    userId: user.id,
                                    userName: user.userName,
                                    email: user.email,
                                }
                                res.status(200).json({
                                    success: true,
                                    tripInfo: tripInfo,
                                    userInfo: {
                                        userId: user._id,
                                        userName: user.userName,
                                        email: user.email,
                                    }
                                });
                            } else { // no user found accord token 
                                console.log('no user found');
                                res.status(200).json({
                                    success: true,
                                    tripInfo: tripInfo,
                                });
                            }
                        })
                    } else { // token expired
                        console.log('token expired: ' + decoded.iat);
                        res.status(200).json({
                            success: true,
                            tripInfo: tripInfo,
                        });
                    }
                }
            })
        } else {  // no token
            console.log('no token');
            res.status(200).json({
                success: true,
                tripInfo: tripInfo,
            });
        }
    } else {
        return res.status(200).json({
            success: false,
            message: 'No invitation code received'
        });
    }
}
exports.addMemberToTrip = async (req, res) => {
    console.log('add member to trip');
    if (req.body.invitationCode) {
        let trip;
        let user;
        await Promise.all([
            User.findById(req.decodedJWT.userId),
            Trip.findOne({ where: { invitationCode: req.body.invitationCode }, include: [{ model: User, as: 'members' }] })
        ]).then(results => {
            console.log('results: ' + results);
            user = results[0];
            trip = results[1];
        }).catch(error => {
            console.error(error);
        })
        if (trip && user) {
            trip.addMember(user);
            // update token
            const payload = {
                userId: user.id,
                // iat is short for is available till
                iat: Date.now() + config.JWTDurationMS
            };
            const token = jwt.sign(payload, superSecret);
            return res.status(200).json({
                success: true,
                token: token,
                tripInfo: {
                    tripId: trip.id,
                    title: trip.title,
                    description: trip.description,
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                    invitationCode: trip.invitationCode,
                    members: trip.members,
                },
                userInfo: {
                    userId: user.id,
                    userName: user.userName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    facebookProfilePictureURL: user.facebookProfilePictureURL
                },
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'no invitation code received'
            });
        }
    } else {
        return res.status(200).json({
            success: false,
            message: 'no invitation code received'
        });
    }
}

exports.inviteMembers = function (req, res) {
    // TODO: add email server
    if (req.body.invitationCode && req.body.emailList) {
        const message = req.body.message ? req.body.message.replace(/\n/g, '<br />') : '';
        let subject = req.body.subject;
        const link = `<p>Click <a href="https://www.gtplanner.com/trip/join?code=${req.body.invitationCode}">here </a>to join the group</p>`;
        const mailOptions = {
            from: 'gtplanner.com@gmail.com', // sender address
            to: req.body.emailList, // list of receivers
            subject: subject, // Subject line
            html: `<p>${message}</p><br />${link}`// body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
            return res.status(200).json({
                success: true,
                numberOfEmails: req.body.emailList.length
            });
        });
    } else {
        return res.status(200).json({
            success: false,
            message: 'no invitation code or email list received'
        });
    }
}