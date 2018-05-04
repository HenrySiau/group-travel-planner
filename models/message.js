'use strict';
module.exports = (sequelize, DataTypes) => {
    var Message = sequelize.define('Message', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
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