const { Sequelize } = require('sequelize');
const path = require("path");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./database.sqlite",
    logging: false // disable SQL logs
});

module.exports = sequelize;