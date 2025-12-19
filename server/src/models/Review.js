const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
    },
    professorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'professors',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'reviews',
    timestamps: true,
    updatedAt: false,
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });
    Review.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Review.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
  };

  return Review;
};

