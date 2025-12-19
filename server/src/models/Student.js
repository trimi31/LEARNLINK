const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'students',
    timestamps: true,
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Student.hasMany(models.Booking, {
      foreignKey: 'studentId',
      as: 'bookings',
    });
    Student.hasMany(models.Payment, {
      foreignKey: 'studentId',
      as: 'payments',
    });
    Student.hasMany(models.Review, {
      foreignKey: 'studentId',
      as: 'reviews',
    });
    Student.hasMany(models.Conversation, {
      foreignKey: 'studentId',
      as: 'conversations',
    });
  };

  return Student;
};

