var mongoose = require('mongoose');

var blacklistSchema = new mongoose.Schema({
    expireAt: {type: Date, expires: 0},
    token: {
        type: String,
        required: true,
        min: 160,
        max: 165
    }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
