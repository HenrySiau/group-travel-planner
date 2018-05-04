'use strict';
module.exports = (sequelize, DataTypes) => {
    var CheckListItem = sequelize.define('CheckListItem', {
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

    }, {});
    CheckListItem.associate = function (models) {

    };
    return CheckListItem;
};