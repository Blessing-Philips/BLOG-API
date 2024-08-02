const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');

const verifyToken = (req, res, next) => {
    let token = req.cookies.access_token;
    if (!token) {
        next(errorHandler(401, 'Unauthorized user'));
    }
    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };