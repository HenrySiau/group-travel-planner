var { User, Trip } = require('../../models');
var superSecret = require('../../config').superSecret;
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Sequelize = require('sequelize');
var settings = require('../../config');

const strip = (str) => {
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
    Trip.findAll({
        include: [{
            model: User, as: 'owner',
            attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
        }]
    })
        .then(trips => {
            return res.json(trips);
        })
}

exports.register = async (req, res) => {
    console.log('register: ' + req.body);
    if (req.body.email &&
        req.body.userName &&
        req.body.password) {
        const invitationCode = req.body.invitationCode;
        let user;
        let trip;
        let userInfo;
        let tripInfo;
        let token;
        const userData = {
            email: strip(req.body.email),
            userName: strip(req.body.userName),
            password: strip(req.body.password),
            phoneNumber: req.body.phoneNumber && strip(req.body.phoneNumber),
        };
        user = await User.create(userData).catch(error => {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'can not create this user'
            });
        });
        userInfo = {
            userId: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture || '',
        };
        if (invitationCode) {
            // if (true) {
            console.log('with invitationCode: ' + invitationCode);
            trip = await Trip.findOne({
                where: { invitationCode: invitationCode },
                include: [{
                    model: User, as: 'members',
                    attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
                }]
            })
                .catch(error => {
                    console.error(error);
                })
        }
        if (trip) {
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
            res.io.to(trip.id).emit('new member', userInfo);
        }
        const payload = {
            userId: user.id,
            // iat is short for is available till
            iat: Date.now() + config.JWTDurationMS
        };
        token = jwt.sign(payload, superSecret);
        return res.status(200).json({
            success: true,
            message: 'new user created and joined a trip',
            token: token,
            userInfo: userInfo,
            tripInfo: tripInfo
        });
    } else {   // user registration form missing information
        return res.status(400).json({
            success: false,
            message: 'please complete the form'
        });
    }
}

exports.signIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        console.log('LoginWithPassword');
        console.log(req.body);
        const invitationCode = req.body.invitationCode;
        let user;
        let trip;
        let userInfo;
        let tripInfo;
        let token;
        const userData = {
            email: strip(req.body.email),
            password: strip(req.body.password),
        };
        user = await User.findOne({ where: userData }).catch(error => {
            console.error(error);
        });
        if (user) {
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
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        if (invitationCode) {
            // if (true) {
            console.log('with invitationCode: ' + invitationCode);
            trip = await Trip.findOne({
                where: { invitationCode: invitationCode },
                include: [{
                    model: User, as: 'members',
                    attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
                }]
            })
                .catch(error => {
                    console.error(error);
                })
        }
        if (trip) {
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
            res.io.to(trip.id).emit('new member', userInfo);
        } else {
            // fetch default trip
            console.log('get default trip');
            await user.getTrips({
                where: { endDate: { [Sequelize.Op.gte]: Date.now() } },
                order: ['endDate'],
                limit: 1,
                include: [{ model: User, as: 'members', attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL'] }]
            })
                .then(results => {
                    if (results) {
                        const defaultTrip = results[0];
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
                    }

                })
        }

        return res.status(200).json({
            success: true,
            message: 'new user created and joined a trip',
            token: token,
            userInfo: userInfo,
            tripInfo: tripInfo
        });
    }
}

//   https://localhost:3000/trip/join?code=LSDgXc58
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
                Trip.findOne({
                    where: { invitationCode: invitationCode },
                    include: [{
                        model: User, as: 'members',
                        attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
                    }]
                })
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
            res.io.to(trip.id).emit('new member', userInfo);
        } else if (!isNewUser) { // if not a new user
            // fetch default trip
            console.log('get default trip');
            await user.getTrips({
                where: { endDate: { [Sequelize.Op.gte]: Date.now() } },
                order: ['endDate'],
                limit: 1,
                include: [{
                    model: User, as: 'members',
                    attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
                }]
            })
                .then(results => {
                    if (results) {
                        const defaultTrip = results[0];
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
                    }

                })
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
                    // res.io.emit('new message', 'new message from Xiao');
                    // importedIo.emit('new message', 'new message from importedIo');
                    User.findById(decoded.userId).then(
                        async (user) => {
                            if (user) {
                                let tripInfo;
                                // fetch default trip
                                console.log('get default trip');
                                await user.getTrips({
                                    where: { endDate: { [Sequelize.Op.gte]: Date.now() } },
                                    order: ['endDate'],
                                    limit: 1,
                                    include: [{
                                        model: User, as: 'members',
                                        attributes: ['id', 'userName', 'email', 'profilePicture', 'facebookProfilePictureURL']
                                    }]
                                })
                                    .then(results => {
                                        if (results) {
                                            const defaultTrip = results[0];
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
                                        }

                                    })
                                // update token
                                const payload = {
                                    userId: user.id,
                                    // iat is short for is available till
                                    iat: Date.now() + config.JWTDurationMS
                                };
                                const token = jwt.sign(payload, superSecret);
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
                                    },
                                    tripInfo: tripInfo,
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

