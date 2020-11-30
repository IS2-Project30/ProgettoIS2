var mongoose = require('mongoose');

var objectSchema = new mongoose.Schema({
    name: {
        type: Sting,
        required: true,
        min: 1,
        max: 255
    },
    coll_id: {
        type: string,
        required: true
    },
    tag_list: {
        type: [ {tag: String, value: String} ]
    }
});

module.exports = mongoose.model('Object', objectSchema);
