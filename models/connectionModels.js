const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    connectionTopic: {type: String, required: [true, "The topic of the connection is required"]},
    connectionTitle: {type: String, required: [true, "The title of the connection is required"]},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: String, required: [true, "The meeting has to occur at a specific date"]},
    start: {type: String, required: [true, "The meeting is going to start a specific time"]},
    end: {type: String, required: [true, "The meeting is going to end a certain time"]},
    location: {type: String, required: [true, "The meeting is going to be held somewhere, either online or at a specific location"]},
    details: {type: String, required: [true, "The meeting needs a description, it allows people to know what the meeting is about"]},
    image: {type: String, required: [true, "You should provide a URL of the movie poster, so people know what the movie looks like"]}
});

module.exports = mongoose.model('Connection', connectionSchema);