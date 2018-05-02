'use strict';
module.exports = (sequelize, DataTypes) => {
    var Itinerary = sequelize.define('Itinerary', {
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