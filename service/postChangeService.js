async function saveRecordForCondition(Change, guid, condition, res) {
    try {

        const change = await Change.findOne({ guid, condition: condition[0] })
        change ? updateSavedRecord(Change, guid, condition) : createNewRecord(Change, guid, condition);
        
    } catch (err) {
        return res.send(err);
    }
}

function updateSavedRecord(Change, guid, condition) {

    const updateObject = createDBOBject(condition, true)

    Change.findOneAndUpdate({ guid, condition: condition[0] },
        { $push: { ...updateObject } }
        )
}

function createNewRecord(Change, guid, condition) {
    const newChange = new Change({ guid, condition: condition[0], ...createDBOBject(condition, false) })

    newChange.save();
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

const testables = { createDBOBject }


module.exports = { saveRecordForCondition, testables }