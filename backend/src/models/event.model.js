const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Event = sequelize.define('Event', {
    id: { type: DataTypes.STRING, primaryKey: true},
    title: { type: DataTypes.STRING },
    source: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    start_time: { type: DataTypes.DATE },
    venue: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    category: { type:DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    pii_score: {type: DataTypes.STRING, defaultValue: null},
    attendance_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    timestamps: true
});

module.exports = Event;