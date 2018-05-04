'use strict';
module.exports = (sequelize, DataTypes) => {
    var Trip = sequelize.define('Trip', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [2, 30], },
        },
        description: {
            type: DataTypes.STRING,
            validate: { max: 300 }
        },
        invitationCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        isActive: {
            type: DataTypes.STRING,
            defaultValue: true,
        },

    }, {});
    Trip.associate = function (models) {
        Trip.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'ownerUserId',
            allowNull: false,
        });
        Trip.belongsTo(models.Itinerary, {
            as: 'itinerary',
            foreignKey: 'itineraryId',
        });
        Trip.belongsToMany(models.User, {
            as: 'members',
            through: 'member',
            foreignKey: 'tripId',
        });
        Trip.belongsToMany(models.User, {
            as: 'admins',
            through: 'admin',
            foreignKey: 'tripId',
        });
        Trip.hasMany(models.TripPhoto, {
            as: 'photos',
            foreignKey: 'tripId',
        });
        Trip.hasMany(models.Idea, {
            as: 'ideas',
            foreignKey: 'tripId',
        });
    };
    return Trip;
};