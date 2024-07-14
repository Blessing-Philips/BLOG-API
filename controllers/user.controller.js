const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model')

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    let existingUsername = await User.findOne({ username: req.body.username });
    let existingEmail = await User.findOne({ email: req.body.email });
    let hashedPassword = bcryptjs.hashSync(password, 10)

    if (
        username === " " ||
        email === " " ||
        password === " "
    ) {
        return res.json({ message: "All fields required" })
    } else if (password.length < 6) {
        return res.json({ message: "Password length should not be less than 6" })
    } else if (existingUsername) {
        return res.json({ message: "Username already exists" })
    } else if (existingEmail) {
        return res.json({ message: "Email already exists" })
    }

    try {
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const user = await newUser.save()
        return res.status(200).json("Signup successful");
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const signin = async (req, res) => {
    const { username, password } = req.body

    
}

module.exports = { signup }