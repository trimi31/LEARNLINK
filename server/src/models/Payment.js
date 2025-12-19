const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
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
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bookings',
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MOCK',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING',
    },
    externalRef: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'payments',
    timestamps: true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });
    Payment.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    Payment.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
  };

  return Payment;
};

