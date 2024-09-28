const mongoose = require('mongoose');

const registeredUserSchema = new mongoose.Schema({
    name: { type: String, default: null, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null,required: true },
    address: { type: String, default: null,required: true },
    propertyType: { type: String, default: null,required: true },
    propertyName: { type: String, default: null },
    noOfPeople: { type: Number, default: null },
});

module.exports = mongoose.model('RegisteredUser', registeredUserSchema);