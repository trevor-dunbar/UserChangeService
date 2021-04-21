const mongoose = require('mongoose');
const { Schema } = mongoose;

const changeModel = new Schema({
    guid: { type: String, required: true },
    condition: { type: String, required: true},
    
}, { strict: false });

module.exports = mongoose.model('Change', changeModel);