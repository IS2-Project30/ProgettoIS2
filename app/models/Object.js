var mongoose = require('mongoose');

var objectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    id_coll: {
        type: String,
        required: true
    },
    tag_list: {
        type: [ {tag: String, value: String} ]
    },
	objectImage: {
		type: String,
		required: false
	}
});

module.exports = mongoose.model('Object', objectSchema);
