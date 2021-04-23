function saveRecordForCondition(Change, guid, condition, res) {
    Change.findOne({ guid, condition: condition[0] }, (err, change) => {

        if (err) {
            return res.send(err);
        }

        change ? updateSavedRecord(Change, guid, condition, res) : createNewRecord(Change, guid, condition, res);
    })
}

function updateSavedRecord(Change, guid, condition, res) {

    const updateObject = createDBOBject(condition, true)

    Change.findOneAndUpdate({ guid, condition: condition[0] },
        { $push: { ...updateObject } },
        (err, change) => {
            if (err) {
                console.log(err)
                return res.send(err);
            }
        })
}

function createNewRecord(Change, guid, condition, res) {
    const newChange = new Change({ guid, condition: condition[0], ...createDBOBject(condition, false) })

    newChange.save((err) => {
        if (err) return res.send(err);
    });
}

function createDBOBject(condition, isUpdate) {
    const dbObject = {}

    const conditionMeasurements = Object.entries(condition[1]);

    conditionMeasurements.forEach((measurementKeyValue) => {
        addTimeForMeasurement(measurementKeyValue, dbObject, isUpdate)
    })
    return dbObject
}

function addTimeForMeasurement(measurementKeyValue, dbObject, isUpdate) {
    const measurementKey = measurementKeyValue[0]
    const measurementValue = measurementKeyValue[1]

    if (Array.isArray(measurementValue)) {
        const measurementsWithTime = addTimeForMeasurementArray(measurementValue)

        dbObject[measurementKey] = isUpdate ?
            { $each: measurementsWithTime }
            : measurementsWithTime
    }
    else {
        dbObject[measurementKey] = isUpdate ?
            { ...measurementValue, dateTime: new Date().toISOString() }
            : [{ ...measurementValue, dateTime: new Date().toISOString() }]
    }
}


function addTimeForMeasurementArray(listOfMeasurements) {
    const arr = []

    listOfMeasurements.forEach((measurement) => {
        arr.push({ ...measurement, dateTime: new Date().toISOString() })
    })
    return arr;
}

const testables = { updateSavedRecord, createNewRecord }


module.exports = { saveRecordForCondition, testables }