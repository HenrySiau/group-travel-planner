'use strict';
module.exports = (sequelize, DataTypes) => {
    var CheckListItem = sequelize.define('CheckListItem', {
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