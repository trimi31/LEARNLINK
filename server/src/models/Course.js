const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    professorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'professors',
        key: 'id',
      },
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
      defaultValue: 'BEGINNER',
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'courses',
    timestamps: true,
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Course.hasMany(models.Lesson, {
      foreignKey: 'courseId',
      as: 'lessons',
      onDelete: 'CASCADE',
    });
    Course.hasMany(models.Review, {
      foreignKey: 'courseId',
      as: 'reviews',
      onDelete: 'CASCADE',
      hooks: true,
    });
    Course.hasMany(models.Booking, {
      foreignKey: 'courseId',
      as: 'bookings',
      onDelete: 'SET NULL',
      hooks: true,
    });
    Course.hasMany(models.Payment, {
      foreignKey: 'courseId',
      as: 'payments',
      onDelete: 'SET NULL',
      hooks: true,
    });
  };

  return Course;
};

