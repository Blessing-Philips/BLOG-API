const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model')
const { errorHandler } = require('../utilities/error')

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    let existingUsername = await User.findOne({ username: req.body.username });
    let existingEmail = await User.findOne({ email: req.body.email });

    /* Hashing of inputted password. "password" is the password to be hashed; "10" is the salt - how complex
        or how many time the hashing should be done to give a hashed password. Most used is 10; An higer would
        be more complex, but longer hashing time.
    */
    let hashedPassword = await bcryptjs.hashSync(password, 10);

    /* When I didn't include the first 3 conditions, it wasn't valid and the expected response wasn't gotten,
    works perfectly after including...
    */
    if (!username ||
        !email ||
        !password ||
        username == " " ||
        email == " " ||
        password == " "
    ) {
        // return res.json({ message: "All fields required" });
        return next(errorHandler(400, "All fields are required"));
    } else if (password.length < 6) {
        return next(errorHandler(400, "Password length should not be less than 6"));
    } else if (existingUsername) {
        return next(errorHandler(400, "Username already exists"));
    } else if (existingEmail) {
        return next(errorHandler(400, "Email already exists"));
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
    catch (error) {
        return res.status(500).json(error.message);
    }
};


const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (
            !email ||
            !password ||
            email == " " ||
            password == " "
        ) {
            return next(errorHandler(400, "All fields are required"));
        }

        let validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        };

        let validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, "Invalid credential"));
        };

        // Creating an access token for authorization
        let token = jwt.sign({ id: validUser._id }, process.env.JWT_TOKEN);

        /* This is object destructuring with renaming and the rest operator in JavaScript. It is used when we
        want a property to be removed/hidden in an object. The property we want hidden is renamed, as you can
        see (password: pass); We can hide more that a property : 
        let { password: pass, username: name, ...rest } = validUser._doc 
        The "...rest" contains the remaining properties that are remaining. Go to line 84
        */
        let { password: pass, ...rest } = validUser._doc
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
            })
            /* Here, the "rest" is outputted - the part we don't want hidden. Also we can output the 
            redefined property(ies)*/
            .json({ "Signin Successful": { rest } })
    }
    catch (error) {
        next(error)
    };

};

module.exports = {
    signup,
    signin
};