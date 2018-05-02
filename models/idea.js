'use strict';
module.exports = (sequelize, DataTypes) => {
    var Idea = sequelize.define('Idea', {
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING,
        },
        startAt: DataTypes.DATE,
        endAt: DataTypes.DATE,

    }, {});
    Idea.associate = function (models) {
        Idea.belongsTo(models.Trip, {
            as: 'trip',
            foreignKey: 'tripId'
        });
        Idea.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'userId'
        });
        Idea.belongsTo(models.Itinerary, {
            as: 'itinerary',
            foreignKey: 'itineraryId'
        });
    };
    return Idea;
};