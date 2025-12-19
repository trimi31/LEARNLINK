const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Availability = sequelize.define('Availability', {
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'UTC',
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'availability',
    timestamps: true,
  });

  Availability.associate = (models) => {
    Availability.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Availability.hasOne(models.Booking, {
      foreignKey: 'availabilityId',
      as: 'booking',
    });
  };

  return Availability;
};

