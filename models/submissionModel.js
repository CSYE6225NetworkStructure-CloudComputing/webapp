const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Submission = sequelize.define('Submission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        assignment_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Assignments', // this matches the name of your Assignment table
                key: 'id'
            }
        },

        createdByUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            // references: {
            //     model: 'Accounts', //Account table name
            //     key: 'id'
            // }
        },

        submission_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        submission_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        submission_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    // Association with Assignment
    Submission.associate = models => {
        Submission.belongsTo(models.Assignment, {
          foreignKey: 'assignment_id',
          as: 'assignment'
        });
        Submission.belongsTo(models.Account, {
          foreignKey: 'createdByUserId',
          as: 'user'
        });
      };
    
    return Submission;
};
