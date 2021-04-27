const _ = require('lodash');

function softDeleteMeasurement(req, change, res) {
    const measurementsToDelete = Object.entries(req.body);
    let shouldSave = false

    measurementsToDelete.forEach((measurementKeyValue) => {
        const measurementKey = measurementKeyValue[0];
        const measurementValue = measurementKeyValue[1];
        const measurementsForKey = change._doc[measurementKey]

        const indexOfMeasurementsUpdate = findUpdateIndex(measurementsForKey, measurementValue)
        const measurementToDelete = measurementsForKey[indexOfMeasurementsUpdate];

        if (indexOfMeasurementsUpdate == -1 || measurementToDelete.isDeleted) {
            return res.status(404)
        }

        measurementsForKey[indexOfMeasurementsUpdate] = { ...measurementToDelete, isDeleted: true }
        shouldSave = true
        change.markModified(measurementKey);
        })

        if (shouldSave){
            change.save();
        }
}

function findUpdateIndex(listOfMeasurements, measurementToDelete) {
    return listOfMeasurements.findIndex((measurement) => {
        return _.isEqual(measurement, measurementToDelete)
    })
}

module.exports = { softDeleteMeasurement }