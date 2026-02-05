// models/UserEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');
const Event = require('./event.model');

const EventUser = sequelize.define('UserEvent', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  eventId: { type: DataTypes.STRING, allowNull: false },
  attended: { type: DataTypes.BOOLEAN, defaultValue: false },
});

EventUser.belongsTo(User, { foreignKey: "userId" });
EventUser.belongsTo(Event, { foreignKey: "eventId", targetKey: "id" });

module.exports = EventUser;
