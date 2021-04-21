const _ = require('lodash');

function softDeleteMeasurement(req, change, res) {
    const measurementsToDelete = Object.entries(req.body);

    measurementsToDelete.forEach((measurementKeyValue) => {
        markMeasurementAsDeleted(measurementKeyValue, change, res)
    })

    change.save();
}

function markMeasurementAsDeleted(measurementKeyValue, change, res) {
    const measurementKey = measurementKeyValue[0];
    const measurementValue = measurementKeyValue[1];
    const measurementsForKey = change._doc[measurementKey]

    const indexOfMeasurementsUpdate = findUpdateIndex(measurementsForKey, measurementValue)
    const measurementToDelete = measurementsForKey[indexOfMeasurementsUpdate];

    if (indexOfMeasurementsUpdate == -1 || measurementToDelete.isDeleted) {
        return res.send(404);
    }

    measurementsForKey[indexOfMeasurementsUpdate] = { ...measurementToDelete, isDeleted: true }
    change.markModified(measurementKey);
}

function findUpdateIndex(listOfMeasurements, measurementToDelete) {
    return listOfMeasurements.findIndex((measurement) => {
        return _.isEqual(measurement, measurementToDelete)
    })
}

module.exports = { softDeleteMeasurement }