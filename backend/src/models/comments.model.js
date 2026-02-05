const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');
const Event = require('./event.model');

const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: { type: DataTypes.INTEGER, allowNull: false},
    event_id: { type: DataTypes.STRING, allowNull: false},
    content: { type: DataTypes.TEXT, allowNull: false},
    create_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},{
    timestamps: false
});

//Associations
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE'});
Comment.belongsTo(Event, { foreignKey: 'event_id', targetKey: 'id', onDelete: 'CASCADE'});

module.exports = Comment;