const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    text: String,
    username: String, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
