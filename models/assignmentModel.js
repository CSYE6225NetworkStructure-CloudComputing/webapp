module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    createdByUserId: {
      type: DataTypes.UUID,
      allowNull: false, // Adjusted to disallow null
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Only whole numbers are allowed for num_of_attempts.',
        },
        min: {
          args: 1,
          msg: 'Value must be at least 1.',
        },
        max: {
          args: 100,
          msg: 'Value cannot exceed 100.',
        },
    },
  },
    deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
    assignment_created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    readOnly: true,
  },
    assignment_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    readOnly: true,
  }
    });

Assignment.associate = (models) => {
  Assignment.belongsTo(models.Account, { foreignKey: 'createdByUserId' });
};

return Assignment; // Export the Assignment model
  };
