'use strict';
module.exports = (sequelize, DataTypes) => {
    var TripPhoto = sequelize.define('TripPhoto', {
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