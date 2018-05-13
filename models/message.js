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
            allowNull: false
        },
        // tripId: {
        //     type: DataTypes.UUID,
        //     allowNull: false
        // },
        // userId: {
        //     type: DataTypes.UUID,
        //     allowNull: false
        // },
        composedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {});
    Message.associate = function (models) {
        Message.belongsTo(models.Trip, {
            as: 'trip',
            foreignKey: 'tripId',
            allowNull: false,
        });
        Message.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'userId',
            allowNull: false,
        });
    };
    return Message;
};