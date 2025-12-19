const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
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
      allowNull: false,
      references: {
        model: 'professors',
        key: 'id',
      },
    },
    availabilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'availability',
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
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'),
      defaultValue: 'PENDING',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'bookings',
    timestamps: true,
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });
    Booking.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Booking.belongsTo(models.Availability, {
      foreignKey: 'availabilityId',
      as: 'availability',
    });
    Booking.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
    Booking.hasMany(models.Payment, {
      foreignKey: 'bookingId',
      as: 'payments',
    });
  };

  return Booking;
};

