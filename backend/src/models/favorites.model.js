const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');
const Events = require('./event.model');

const Favorite = sequelize.define('Favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    event_id: { type: DataTypes.STRING, allowNull: false },
    event_title: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING, allowNull:false },
    create_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false
});

Favorite.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Favorite.belongsTo(Events, { foreignKey: 'event_id', onDelete: 'CASCADE' });

module.exports = Favorite;