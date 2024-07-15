const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

const db = require('./database/database');
const home = require('./routes/home.route');
const Signup = require('./routes/user.route');

const app = express();

app.use(express.json())
app.use(cors())
dotenv.config()

app.use(home);
app.use('/api/', Signup);

// Creating a middleware that handles every error
app.use((err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error!";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});