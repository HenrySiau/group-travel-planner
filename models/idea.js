'use strict';
module.exports = (sequelize, DataTypes) => {
    var Idea = sequelize.define('Idea', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        startAt: DataTypes.DATE,
        endAt: DataTypes.DATE,
        link: DataTypes.STRING,
        address: DataTypes.STRING,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,

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