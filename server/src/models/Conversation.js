const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
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
  }, {
    tableName: 'conversations',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'professorId'],
      },
    ],
  });

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });
    Conversation.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'messages',
    });
  };

  return Conversation;
};

