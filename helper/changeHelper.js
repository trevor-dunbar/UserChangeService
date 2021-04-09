    function saveRecordForCondition(Change, guid, condition, res) {
        Change.findOne({ guid, condition: condition.condition }, (err, change) => {
            if (err) {
                return res.send(err);
            }
            change ? updateSavedRecord(Change, guid, condition, res) : createNewRecord(Change, guid, condition, res);

        })
    }

    function updateSavedRecord(Change, guid, condition, res) {
        const now = new Date();
        const measurements = { ...condition.measurements, createdAt: now.toISOString() };

        Change.findOneAndUpdate({ guid, condition: condition.condition },
            { $push: { measurements } },
            (err, change) => {
                if (err) {
                    console.log(err)
                    return res.send(err);
                }
            })
    }

    function createNewRecord(Change, guid, condition, res) {
        const now = new Date();
        const measurements = { ...condition.measurements, createdAt: now.toISOString() };

        const newChange = new Change({ guid, condition: condition.condition, measurements })

        newChange.save((err) => {
            if (err) return res.send(err);
        });
    }

    function buildResponseForCondition(change, response) {
        const weeklyMeasurements = getWeeklyMeasurements(change);

        const dailyMeasurements = getDailyMeasurements(change); //try running this on the weekly measurements

        response[change.condition] = { dailyMeasurements, weeklyMeasurements }
    }

    function getWeeklyMeasurements(change) {
        return change.measurements.filter((measurement) => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            return new Date(measurement.createdAt) > oneWeekAgo;
        })
    }

    function getDailyMeasurements(change) {
        return change.measurements.filter((measurement) => {
            const now = new Date();
            const midnight = now.setUTCHours(0, 0, 0, 0)

            return new Date(measurement.createdAt) > midnight
        })
    }

module.exports = { saveRecordForCondition, buildResponseForCondition }