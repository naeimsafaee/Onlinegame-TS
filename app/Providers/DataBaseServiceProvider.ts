// @ts-nocheck
const {Sequelize} = require('sequelize');

const driver = config('database.default')

/*
if (driver === "mysql") {

}
*/

const sequelize = new Sequelize(
    config('database.connections.mysql.database'),
    config('database.connections.mysql.username'),
    config('database.connections.mysql.password'), {
        host: config('database.connections.mysql.host'),
        dialect: config('database.connections.mysql.driver'),
        logging: false
    })

sequelize.authenticate()
    .then(() => console.log('DB Connection has been established successfully.'))
    .catch(() => console.error('Unable to connect to the database.'));

export default sequelize
