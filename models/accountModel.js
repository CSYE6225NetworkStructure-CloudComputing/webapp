const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Account = sequelize.define('Accounts', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      readOnly: true,
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      readOnly: true,
    },
  });

  Account.associate = (models) => {
    Account.hasMany(models.Assignment, {
      foreignKey: 'createdByUserId',
    });
  };

  return Account;
};
