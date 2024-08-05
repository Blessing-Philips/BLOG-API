const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { errorHandler } = require('../utilities/error')
const { verifyToken } = require('../utilities/verify')


const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You are not allowed to update this user"));
    };
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must not be less than 6"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    };
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        };
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        };
        if (req.body.username !== req.body.username.toLowercCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        };
        if (req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        };
    };

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }

};


const deleteUser = async (req, res, next) => {

};

module.exports = {
    updateUser,
    deleteUser
};