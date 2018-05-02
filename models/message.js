'use strict';
module.exports = (sequelize, DataTypes) => {
    var Message = sequelize.define('Message', {
        content: {
            type: DataTypes.STRING,
        }

    }, {});
    Message.associate = function (models) {
        Message.belongsTo(models.Trip, {
            as: 'trip',
            foreignKey: 'tripId',
        });
        Message.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'ownerUserId',
        });
    };
    return Message;
};