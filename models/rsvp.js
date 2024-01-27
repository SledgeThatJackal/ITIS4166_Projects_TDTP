const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    attendee: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'Connection'},
    status: {type: String}
});

module.exports = mongoose.model('RSVP', rsvpSchema);