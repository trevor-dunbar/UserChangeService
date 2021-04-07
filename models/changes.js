const mongoose = require('mongoose');
const { Schema } = mongoose;

const changeModel = new Schema({
    guid: { type: Number, required: true },
    // condition: { type: String, required: true},
    // timeZone: {type: String, required: true},
    // dateTime: {type: Date, default: Date.now},

    // inputValues: {
    //     bloodSugar: Number,
    //     feelings: {
    //         tired: Number,
    //         stressed: Number,
    //         mood: Number,
    //         thirsty: Number,
    //         hungry: Number,
    //     },
    //     notes:{
    //         content: String,
    //         category: String
    //     },
    //     selfCare: {
    //         doctorActivities: Number,
    //         exerciseToday: Number,
    //         eatenToday: Number,
    //         sleptWell: Number,
    //         meditationToday: Number
    //     },
    //     vitals: {
    //         takenVitamins: Boolean,
    //         checkedBloodSugar: Boolean
    //     },
    //     mentalHealth: {
    //         connectedToday: Boolean,
    //         morningWalk: Boolean,
    //         meditation: Boolean
    //     }
    // },
}, { strict: false });

module.exports = mongoose.model('Change', changeModel);