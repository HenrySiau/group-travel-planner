var { Idea } = require('../../models');
const fs = require('fs');
const settings = require('../../config');

const sizeOf = require('image-size');
const sharp = require('sharp');

exports.newIdea = (req, res) => {
    let idea = {
        title: req.body.title,
        address: req.body.address,
        description: req.body.description,
        link: req.body.link,
        // startAt: new Date(parseInt(req.body.startAt)).toString(),
        startAt: new Date(req.body.startAt),
        // endAt: new Date(parseInt(req.body.endAt)).toString(),
        endAt: new Date(req.body.endAt),
        userId: req.body.userId,
        tripId: req.body.tripId,
        type: req.body.type,
        lat: req.body.lat,
        lng: req.body.lng,
        inItinerary: Boolean(Number(req.body.inItinerary)),
    };
    console.log(idea);
    const storeIdeaToDB = (req, res, idea) => {
        if (req.body.title) {
            if (idea.userId === req.decodedJWT.userId) {
                console.log('creating new idea');
                Idea.create(idea).then(newIdea => {
                    console.log('new idea created');
                    res.io.to(idea.tripId).emit('new idea', newIdea);
                    return res.status(200).json({
                        success: true,
                        newIdea: newIdea
                    })
                }).catch(error => {
                    console.error(error);
                })

            } else {
                console.log('no idea data received');
                return res.status(200).json({
                    success: false,
                    message: 'no data received'
                })
            }
        } else {
            return res.status(200).json({
                success: false,
                message: 'no data received'
            })
        }
    }

    if (req.file) {
        const imageType = req.body.imageType;
        const fileName = req.file.filename;
        const ext = '.' + imageType.substring(imageType.lastIndexOf('/') + 1);
        console.log('ext: ' + ext);
        fs.rename(req.file.path, settings.imageUploadFolder + fileName + ext, err => {
            if (err) {
                console.error(err);
            } else {
                let dimensions = sizeOf(settings.imageUploadFolder + fileName + ext);
                if (dimensions && dimensions.width > 500) {
                    sharp(settings.imageUploadFolder + fileName + ext)
                        .resize(parseInt(500))
                        .toFile(settings.imageUploadFolder + fileName + '-500' + ext, (err, info) => {
                            if (err) {
                                console.error(err);
                            }
                            if (info) {
                                idea.coverImage = fileName + '-500' + ext;
                                storeIdeaToDB(req, res, idea);
                                console.log(`resized image: ${settings.imageUploadFolder + fileName + '-500' + ext} `);
                                fs.unlink(settings.imageUploadFolder + fileName + ext, err => {
                                    if (err) {
                                        console.error(err);
                                    }
                                    console.log(`successfully deleted ${settings.imageUploadFolder + fileName + ext}`);
                                });
                            }
                        });
                } else {  // no need to resize
                    idea.coverImage = fileName + ext;
                    storeIdeaToDB(req, res, idea);
                }
            }
        });
    } else {  // no cover image received
        storeIdeaToDB(req, res, idea);
    }
}

exports.getIdeas = (req, res) => {
    // TODO authorization
    if (req.query.tripId) {
        Idea.findAll({ where: { tripId: req.query.tripId } }).then(ideas => {
            console.log(ideas);
            return res.status(200).json({
                success: true,
                ideas: ideas
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

exports.deleteIdea = (req, res) => {
    const ideaId = req.body.ideaId;
    if (ideaId) {
        Idea.destroy({
            where: {
                id: ideaId
            }
        }).then(deletedIdea => {
            return res.status(200).json({
                success: true,
                message: `ideaId: ${ideaId} had been deleted`
            })
        })
            .catch(error => {
                console.log(error);
            })
    }
}


exports.addToItinerary = (req, res) => {
    const ideaId = req.body.ideaId;
    if (ideaId) {
        Idea.findById(ideaId).then(idea => {
            idea.update({ inItinerary: true }).then(() => {
                return res.status(200).json({
                    success: true,
                    message: `ideaId: ${ideaId} had been updated`
                })
            })
        })
            .catch(error => {
                console.log(error);
            })
    }
}

exports.removeFromItinerary = (req, res) => {
    const ideaId = req.body.ideaId;
    if (ideaId) {
        Idea.findById(ideaId).then(idea => {
            idea.update({ inItinerary: false }).then(() => {
                return res.status(200).json({
                    success: true,
                    message: `ideaId: ${ideaId} had been updated`
                })
            })
        })
            .catch(error => {
                console.log(error);
            })
    }
}