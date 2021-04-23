const _ = require('lodash');

function buildResponseForCondition(change, response) {

    const weeklyMeasurements = {}
    const dailyMeasurements = {}

    const measurements = _.omit(change._doc, ['guid', 'condition', '_id', '__v'])
    
    addMeasurementsToDailyAndWeekly(measurements, dailyMeasurements, weeklyMeasurements);
        
    response[change.condition] = { dailyMeasurements, weeklyMeasurements }
}

function addMeasurementsToDailyAndWeekly(measurements, dailyMeasurements, weeklyMeasurements){
    const measurementsKeyVals = Object.entries(measurements)

    measurementsKeyVals.forEach((measurement) => {
        const key = measurement[0]
        const listOfMeasurements = measurement[1]

        dailyMeasurements[key] = getDailyMeasurements(listOfMeasurements);
        weeklyMeasurements[key] = getWeeklyMeasurements(listOfMeasurements);
    })
}
function getDailyMeasurements(list) {
    return list.filter((arrayItem) => {

        const now = new Date();
        const midnight = now.setUTCHours(0, 0, 0, 0)

        return new Date(arrayItem.dateTime) > midnight
    })
}

function getWeeklyMeasurements(list) {
    return list.filter((arrayItem) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return new Date(arrayItem.dateTime) > oneWeekAgo;
    })
}

const testables = { getDailyMeasurements, getWeeklyMeasurements};


module.exports = { buildResponseForCondition, testables }