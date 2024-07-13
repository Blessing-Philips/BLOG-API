//cuBOY8A5BcdoOedH

const mongoose = require('mongoose');
require('dotenv').config();

const databaseUrl = process.env.MONGODB_URI

mongoose 
    .connect(`${databaseUrl}`)
    .then(()=> console.log('Successfully connected to  database'))
    .catch((err) => {
        console.error("Error connecting to database", err.message)
    });

const db = mongoose.connection;

module.exports = db;