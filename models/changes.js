const mongoose = require('mongoose');
const { Schema } = mongoose;

const changeModel = new Schema({
    guid: { type: Number, required: true },
    bloodPressure: { type: Number },
}, { strict: false });

module.exports = mongoose.model('Change', changeModel);