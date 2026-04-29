const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema för en användare
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    account_created: {
        type: Date,
        default: Date.now
    }
});

// Lägger till collectionen user -> users inom mongoDB
const User = mongoose.model("user", userSchema);
// Exporterar schemat för att kunna användas inom resten av filer
module.exports = User;