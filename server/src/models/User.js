const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'PROFESSOR'),
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Student, {
      foreignKey: 'userId',
      as: 'studentProfile',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Professor, {
      foreignKey: 'userId',
      as: 'professorProfile',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Message, {
      foreignKey: 'senderUserId',
      as: 'sentMessages',
    });
  };

  return User;
};

