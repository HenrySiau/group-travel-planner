var { User, Trip } = require('../../models');
var superSecret = require('../../config').superSecret;
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Sequelize = require('sequelize');


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
    // User.findAll().then(users => {
    //     return (users);
    // })
    //     .then((users) => {
    //         console.log('second .then: ' + users);
    //         return res.json(users);
    //     })
    //     .catch(error => { res.send(error) });
    Trip.findAll({ include: [{ model: User, as: 'owner' }] }).then(trips => {
        return res.json(trips);
    })

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
            User.create(userData).then(newUser => {
                const payload = {
                    userId: newUser.id,
                    // iat is short for is available till
                    iat: Date.now() + config.JWTDurationMS
                };
                const token = jwt.sign(payload, superSecret);
                Trip.findOne({ where: { invitationCode: invitationCode } }).then(trip => {
                    if (trip) {
                        trip.update({
                            members: trip.members.push(newUser)
                        }).then(updatedTrip => {    // connect user and trip
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
                                },
                                tripInfo: {
                                    tripId: updatedTrip.id,
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
                                userId: newUser.id,
                                userName: newUser.userName,
                                email: newUser.email,
                                phoneNumber: newUser.phoneNumber,
                                profilePicture: newUser.profilePicture || '',
                            },
                            tripInfo: {
                                tripId: updatedTrip.id,
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
            Trip.findOne({ where: { invitationCode: invitationCode } }).
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
                            trips: [trip.id],
                        };
                        User.create(userData, function (err, newUser) {
                            if (err) {
                                console.error(err);
                            }
                            if (newUser) {
                                console.log('new user had created: ' + newUser.userName);
                                trip.members.push(newUser.id);
                                trip.save((err, updatedTrip) => {
                                    if (err) {
                                        console.err(err);
                                    }
                                    if (updatedTrip) {
                                        console.log(`trip: ${updatedTrip.title}, had been updated`);
                                        const payload = {
                                            userId: newUser.id,
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
                                            tripInfo: {
                                                tripId: updatedTrip.id,
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
                        userId: newUser.id,
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
        User.findOne({ where: { email: req.body.email } }).then(user => {
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

exports.loginWithToken = (req, res) => {
    if (req.body.token) {
        jwt.verify(req.body.token, superSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                console.log('token: ' + decoded);
                // if everything is good, save to request for use in other routes
                if (!(decoded.iat && decoded.userId)) {
                    console.log('decoded: ' + decoded.iat + decoded.userId);
                    return res.status(200).send({
                        success: false,
                        message: 'Invalid token.'
                    });
                    //iat is short for is available till
                } else if (decoded.iat < Date.now()) {
                    return res.status(200).send({
                        success: false,
                        message: 'Token expired.'
                    });
                } else {
                    // fetch userInfo from database
                    User.findById(decoded.userId).then(
                        (user) => {
                            if (user) {
                                // update token
                                const payload = {
                                    userId: user.id,
                                    // iat is short for is available till
                                    iat: Date.now() + config.JWTDurationMS
                                };
                                const token = jwt.sign(payload, superSecret);
                                // TODO : get default trip

                                res.status(200).json({
                                    success: true,
                                    token: token,
                                    userInfo: {
                                        userId: user.id,
                                        userName: user.userName,
                                        email: user.email,
                                        phoneNumber: user.phoneNumber,
                                        profilePicture: user.profilePicture,
                                        facebookProfilePictureURL: user.facebookProfilePictureURL
                                    }
                                });
                            }
                            else {
                                res.status(200).json({
                                    success: false,
                                    message: 'Invalid token'
                                });
                            }
                        }
                    ).catch(error => {
                        console.error(error);
                        res.status(200).json({
                            success: false,
                            message: 'can not find this User in database'
                        });
                    })
                }
            }
        });
    } else {
        res.status(200).json({
            success: false,
            message: 'Invalid token'
        });
    }

}

//   https://localhost:3000/trip/join?code=LSDgXc58
// http://localhost:8080/trip/join?code=LSDgXc58
// TODO required server side verification 
exports.LoginWithFacebook = async (req, res) => {
    if (req.body.email && req.body.userName && req.body.accessToken) {
        const invitationCode = req.body.invitationCode;
        let user;
        let trip;
        let userInfo;
        let tripInfo;
        let token;
        let isNewUser = false;

        if (invitationCode) {
        // if (true) {
            console.log('with invitationCode: ' + invitationCode);
            await Promise.all([
                User.findOne({ where: { email: req.body.email } }),
                Trip.findOne({ where: { invitationCode: invitationCode }, include: [{ model: User, as: 'members' }] })
            ]).then(results => {
                console.log('results: ' + results);
                user = results[0];
                trip = results[1];
            }).catch(error => {
                console.error(error);
            })
        } else {
            user = await User.findOne({ where: { email: req.body.email } }).catch(error => {
                console.error(error);
            });
        }
        console.log('after origin fetching')
        console.log('user: ' + user);
        console.log('trip: ' + trip);
        if (!user) {
            isNewUser = true;
            // create new user
            console.log('create new user');
            const userData = {
                email: req.body.email,
                userName: req.body.userName,
                isSocialAuth: true,
                facebookProfilePictureURL: req.body.facebookProfilePictureURL,
            };
            await User.create(userData).then(newUser => {
                user = newUser;
            }).catch(error => {
                console.error(error);
            })
        }
        const payload = {
            userId: user.id,
            // iat is short for is available till
            iat: Date.now() + config.JWTDurationMS
        };
        token = jwt.sign(payload, superSecret);
        userInfo = {
            userId: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture || '',
        };

        // get trip info
        if (trip) {
            // add user to trip member
            console.log('trip.addMember');
            trip.addMember(user);
            tripInfo = {
                tripId: trip.id,
                title: trip.title,
                description: trip.description,
                owner: trip.owner,
                members: trip.members,
                startDate: trip.startDate,
                endDate: trip.endDate,
                invitationCode: trip.invitationCode
            }
        } else if (!isNewUser) { // if not a new user
            // fetch default trip
            console.log('get default trip');
            await Trip.findOne({ where: { endDate: { [Sequelize.Op.gte]: Date.now() } }, order: ['endDate', 'DESC'], limit: 1 }).then(defaultTrip => {
                if (defaultTrip) {
                    tripInfo = {
                        tripId: defaultTrip.id,
                        title: defaultTrip.title,
                        description: defaultTrip.description,
                        owner: defaultTrip.owner,
                        members: defaultTrip.members,
                        startDate: defaultTrip.startDate,
                        endDate: defaultTrip.endDate,
                        invitationCode: defaultTrip.invitationCode
                    }
                }
            }).catch(error => {
                console.error(error);
            });
        }
        // return
        return res.status(200).json({
            success: true,
            token: token,
            userInfo: userInfo,
            tripInfo: tripInfo,
        })

    } else {
        res.status(401).json({
            success: false,
            message: 'lake of information'
        });
    }
}