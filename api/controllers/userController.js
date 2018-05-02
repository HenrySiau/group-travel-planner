var { User, Trip } = require('../../models');
var superSecret = require('../../config').superSecret;
var jwt = require('jsonwebtoken');
var config = require('../../config');


strip = (str) => {
    return str.replace(/^\s+|\s+$/g, '');
}

exports.setUser = (req, res) => {
    return User
        .create({
            userName: 'Henry',
            email: 'henry@henry.com'
        })
        .then(user => { res.send(user.userName) })
        .catch(error => { res.send(error) });

}

exports.getUsers = async (req, res) => {
    User.findAll().then(users => {
        return (users);
    })
        .then((users) => {
            console.log('second .then: ' + users);
            return res.json(users);
        })
        .catch(error => { res.send(error) });

}

exports.register = (req, res) => {
    console.log('register: ' + req.body);
    if (req.body.email &&
        req.body.userName &&
        req.body.password &&
        req.body.passwordConfirm) {
        if (req.body.password != req.body.passwordConfirm) return res.status(400).json({
            success: false,
            message: 'password and confirm password not match'
        });
        const invitationCode = req.body.invitationCode;
        if (invitationCode) {
            console.log('Invitation Code: ' + invitationCode);
            const userData = {
                email: strip(req.body.email),
                userName: strip(req.body.userName),
                password: strip(req.body.password),
                phoneNumber: req.body.phoneNumber && strip(req.body.phoneNumber),
            };
            User.create().then(newUser => {
                const payload = {
                    userId: newUser._id,
                    // iat is short for is available till
                    iat: Date.now() + config.JWTDurationMS
                };
                const token = jwt.sign(payload, superSecret);
                Trip.findOne({ invitationCode: invitationCode }).then(trip => {
                    if (trip) {
                        trip.update({
                            members: trip.members.push(newUser)
                        }).then(updatedTrip => {    // connect user and trip
                            return res.status(200).json({
                                success: true,
                                message: 'new user created and joined a trip',
                                token: token,
                                userInfo: {
                                    userId: newUser._id,
                                    userName: newUser.userName,
                                    email: newUser.email,
                                    phoneNumber: newUser.phoneNumber,
                                    profilePicture: newUser.profilePicture || '',
                                },
                                tripInfo: {
                                    tripId: updatedTrip._id,
                                    title: updatedTrip.title,
                                    description: updatedTrip.description,
                                    owner: updatedTrip.owner,
                                    members: updatedTrip.members,
                                    startDate: updatedTrip.startDate,
                                    endDate: updatedTrip.endDate,
                                    invitationCode: updatedTrip.invitationCode
                                }
                            });
                        }).catch(error => {
                            console.error(error);
                            return res.status(200).json({
                                success: false,
                                message: 'can not connect trip and user',
                            });
                        })
                    } else {// can not find 
                        return res.status(200).json({
                            success: true,
                            message: 'new user created and joined a trip',
                            token: token,
                            userInfo: {
                                userId: newUser._id,
                                userName: newUser.userName,
                                email: newUser.email,
                                phoneNumber: newUser.phoneNumber,
                                profilePicture: newUser.profilePicture || '',
                            },
                            tripInfo: {
                                tripId: updatedTrip._id,
                                title: updatedTrip.title,
                                description: updatedTrip.description,
                                owner: updatedTrip.owner,
                                members: updatedTrip.members,
                                startDate: updatedTrip.startDate,
                                endDate: updatedTrip.endDate,
                                invitationCode: updatedTrip.invitationCode
                            }
                        });
                    }
                }).catch(error => {
                    console.error(error);
                    return res.status(200).json({
                        success: false,
                        message: 'something went wrong',
                    });
                })
            }).catch(error => {
                console.error(error);
                return res.status(200).json({
                    success: false,
                    message: 'something went wrong',
                });
            })
            Trip.findOne({ invitationCode: invitationCode }).
                exec((err, trip) => {
                    if (err) {
                        console.err(err);
                    }
                    if (trip) {
                        console.log('found the trip :' + trip.title);
                        const userData = {
                            email: strip(req.body.email),
                            userName: strip(req.body.userName),
                            password: strip(req.body.password),
                            phoneNumber: req.body.phoneNumber && strip(req.body.phoneNumber),
                            trips: [trip._id],
                        };
                        User.create(userData, function (err, newUser) {
                            if (err) {
                                console.error(err);
                            }
                            if (newUser) {
                                console.log('new user had created: ' + newUser.userName);
                                trip.members.push(newUser._id);
                                trip.save((err, updatedTrip) => {
                                    if (err) {
                                        console.err(err);
                                    }
                                    if (updatedTrip) {
                                        console.log(`trip: ${updatedTrip.title}, had been updated`);
                                        const payload = {
                                            userId: newUser._id,
                                            // iat is short for is available till
                                            iat: Date.now() + config.JWTDurationMS
                                        };
                                        const token = jwt.sign(payload, superSecret);
                                        return res.status(200).json({
                                            success: true,
                                            message: 'new user created and joined a trip',
                                            token: token,
                                            userInfo: {
                                                userId: newUser._id,
                                                userName: newUser.userName,
                                                email: newUser.email,
                                                phoneNumber: newUser.phoneNumber,
                                                profilePicture: newUser.profilePicture || '',
                                                trips: newUser.trips,
                                            },
                                            tripInfo: {
                                                tripId: updatedTrip._id,
                                                title: updatedTrip.title,
                                                description: updatedTrip.description,
                                                owner: updatedTrip.owner,
                                                members: updatedTrip.members,
                                                startDate: updatedTrip.startDate,
                                                endDate: updatedTrip.endDate,
                                                invitationCode: updatedTrip.invitationCode
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            //
        }
        else {   // no invitation code
            const userData = {
                email: strip(req.body.email),
                userName: strip(req.body.userName),
                password: strip(req.body.password),
                phoneNumber: req.body.phoneNumber && strip(req.body.phoneNumber),
            };
            User.create(userData)
                .then(newUser => {
                    const payload = {
                        userId: newUser._id,
                        // iat is short for is available till
                        iat: Date.now() + config.JWTDurationMS
                    };
                    const token = jwt.sign(payload, superSecret);
                    return res.status(200).json({
                        success: true,
                        message: 'new user created and joined a trip',
                        token: token,
                        userInfo: {
                            userId: newUser.id,
                            userName: newUser.userName,
                            email: newUser.email,
                            phoneNumber: newUser.phoneNumber,
                            profilePicture: newUser.profilePicture || '',
                            trips: newUser.trips,
                        },
                    });
                })
                .catch(error => {
                    console.err(err);
                    return res.status(200).json({
                        success: false,
                        message: 'something went wrong',
                    });
                })
        }
    } else {
        // user registration form missing information
        return res.status(400).json({
            success: false,
            message: 'please complete the form'
        });
    }
}

exports.validateEmailExist = function (req, res) {
    if (req.body.email) {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(200).json({
                    success: true,
                    exist: true,
                    message: 'Email already exist please'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    exist: false,
                    message: 'Email ok to use'
                });
            }
        }).catch(error => {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server Side error'
            });
        })
    } else {
        return res.status(200).json({
            success: false,
            message: 'Did not get the email'
        });
    }
}
