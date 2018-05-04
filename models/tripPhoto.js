'use strict';
module.exports = (sequelize, DataTypes) => {
    var TripPhoto = sequelize.define('TripPhoto', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING,
        },
        path: {
            type: DataTypes.STRING,
        },

    }, {});
    TripPhoto.associate = function (models) {
        TripPhoto.belongsTo(models.Trip, {
            as: 'trip',
            foreignKey: 'tripId'
        });
        TripPhoto.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'userId'
        });
    };
    return TripPhoto;
};