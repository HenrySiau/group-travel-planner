var { Idea } = require('../../models');

exports.newIdea = (req, res) => {
    console.log(req.body);
    // TODO authorization decodedJWT userId
    if (req.body.idea) {
        if (req.body.idea.userId === req.decodedJWT.userId) {
            Idea.create(req.body.idea).then(newIdea => {
                res.io.to(req.body.idea.tripId).emit('new idea', newIdea);
                return res.status(200).json({
                    success: true,
                    newIdea: newIdea
                })
            }).catch(error => {
                console.error(error);
            })
        }
    } else {
        return res.status(200).json({
            success: false,
            message: 'no data received'
        })
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