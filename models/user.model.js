const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0BtdJZCkObbxHoSHPyHsxm&ust=1721287933106000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMj049LHrYcDFQAAAAAdAAAAABAE"
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);