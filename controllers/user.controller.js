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


// Google authentication and authorization
const googleAuth = async (req, res, next) => {
    const { email, username, googlePhotoUrl } = req.body
    try {
        /* This is for if a user has an account already and wants to sign in 
        */
        let user = await User.findOne({ email });
        if (user) {
            let token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
            let { password, ...rest } = user._doc;

            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json({ user: { rest } });

            /* This is for if the email does not exist yet - The user wants to sign up
            In this case, we'd have to generate a password ourself(as you've experienced on other sites)
            and thet user can change it later, then we generate a username also and a default photo is put,
            if the user does not upload a photo.
            */
        } else {
            /* This includes using the randomm property in the Math library, converting to string(36 means a to z ans 0 to 9),
             and using the last 4 characters generated. Doing again and adding both to make the password 8 and stronger */
            let generatedPassword = Math.random().toString(36).slice(-4) + Math.random().toString(36).slice(-4);
            console.log(generatedPassword)
            // Hashing the generated password
            let hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            let newUser = new User({
                /* The ussername contains converting the inputted name to lower case, splitting, and joining, then adding the last 
                3 random generated numbers(meaning of 9) to the username */
                username: username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });
            await newUser.save();
            let token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN);
            let { password, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(newUser);
        };
    }
    catch (error) {
        next(error)
    }
};

module.exports = {
    signup,
    signin,
    googleAuth
};