const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

// User model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    twitter: {

        id: {
            type: String,
            unique: true
        },

        token: {
            type: String,
            unique: true
        },

        displayName: String,

        handle: {
            type: String,
            unique: true
        },

        photo: String
    }
});

userSchema.plugin(uniqueValidator);

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;