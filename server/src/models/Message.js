const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id',
      },
    },
    senderUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'messages',
    timestamps: true,
    updatedAt: false,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });
    Message.belongsTo(models.User, {
      foreignKey: 'senderUserId',
      as: 'sender',
    });
  };

  return Message;
};

