'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 20], },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    facebookProfilePictureURL: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      }
    },
    isFacebookLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }

  }, {
      indexes: [
        {
          unique: true,
          fields: ['email']
        }
      ]
    });
  User.associate = function (models) {
    User.belongsToMany(models.Trip, {
      as: 'trips',
      through: 'member',
      foreignKey: 'userId',
    });
    User.belongsToMany(models.Trip, {
      as: 'adminTrips',
      through: 'admin',
      foreignKey: 'userId',
    });
    User.hasOne(models.Trip, {
      as: 'defaultTrip',
      foreignKey: 'defaultTripId',
      allowNull: true,
      defaultValue: null
    });

  };
  return User;
};