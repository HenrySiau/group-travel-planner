'use strict';
module.exports = (sequelize, DataTypes) => {
    var Itinerary = sequelize.define('Itinerary', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        }

    }, {});
    Itinerary.associate = function (models) {
        Itinerary.hasMany(models.Idea, {
            as: 'ideas',
            foreignKey: 'ideaId',
        });
    };
    return Itinerary;
};