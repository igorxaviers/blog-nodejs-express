const sequelize = require('sequelize');
const connection = new sequelize('heroku_bad643d9acf61b5', 'b33f0f9c395cd7', 'a9c1469e', {
    host: 'us-cdbr-east-05.cleardb.net',
    dialect: 'mysql'
});
module.exports = connection;