var jwt = require('jsonwebtoken');
var superSecret = require('./config').superSecret;
const fs = require('fs');
const sharp = require('sharp');
/**
 * This is a description of the loginRequired middleware
 */
// TODO: add a function to limit heavy request
// TODO: add redis database to store recently visited tokens 
exports.loginRequired = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                if (!decoded.iat) {
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.'
                    });
                    //iat is short for is available till
                } else if (decoded.iat < Date.now()) {
                    return res.status(498).send({
                        success: false,
                        message: 'Token expired.'
                    });
                } else {
                    req.decodedJWT = decoded;
                    next();
                }

            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

};

exports.mapMembers = members => {
    let membersMap = new Map();
    members.map(member => {
        membersMap.set(member.id, {
            userName: member.userName,
            email: member.email,
            profilePictureUrl: member.profilePicture ? settings.serverUrl + member.profilePicture : member.facebookProfilePictureURL || '',
        })
    });
    console.log('mapMembers size: ' + membersMap.size);
    return membersMap;
}

exports.resizeImage = (path, newPath, width) => {
    sharp(path)
        .resize(parseInt(width))
        .toFile(newPath, (err, info) => {
            if (err) {
                console.error(err);
            }
            if (info) {
                console.log(`resized image: ${newPath} `);
                fs.unlink(path, err => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(`successfully deleted ${path}`);
                });
            }
        });
}