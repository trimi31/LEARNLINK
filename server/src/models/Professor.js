const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Professor = sequelize.define('Professor', {
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
    headline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subjects: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('subjects');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('subjects', JSON.stringify(value));
      },
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'professors',
    timestamps: true,
  });

  Professor.associate = (models) => {
    Professor.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Professor.hasMany(models.Course, {
      foreignKey: 'professorId',
      as: 'courses',
    });
    Professor.hasMany(models.Availability, {
      foreignKey: 'professorId',
      as: 'availabilities',
    });
    Professor.hasMany(models.Booking, {
      foreignKey: 'professorId',
      as: 'bookings',
    });
    Professor.hasMany(models.Review, {
      foreignKey: 'professorId',
      as: 'reviews',
    });
    Professor.hasMany(models.Conversation, {
      foreignKey: 'professorId',
      as: 'conversations',
    });
  };

  return Professor;
};

