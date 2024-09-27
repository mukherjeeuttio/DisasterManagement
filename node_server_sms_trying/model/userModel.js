const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    phone: { type: String, default: "+916289939718" },
    address: { type: String, default: null },
    issue: { type: String, default: null },
    time: { type: Date, default: null },
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "Ongoing" },
    transcribed_text: { type: String, default: null },
    audio: { type: String, default: null, default: null },
    location: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },
    team_assigned: { type: String, default: "team_1" },
});


module.exports = mongoose.model('User', userSchema);