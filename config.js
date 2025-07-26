require('dotenv').config();

module.exports = {
    mongoURI : process.env.MONGO_URI,
    dbName: process.env.MONGO_DB || 'ecommerce',
};