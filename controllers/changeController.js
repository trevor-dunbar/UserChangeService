const changeHelper = require('../helper/changeHelper');

function changesController(Change) {

    function postChange(req, res) {
        const { guid, conditions } = req.body
        if (guid && conditions) {

            conditions.forEach((condition) => { changeHelper.saveRecordForCondition(Change, guid, condition, res) })
            return res.status(201).send();
        }
        res.status(400)
        return res.send('guid and condition are required');
    }

    function getChanges(req, res) {
        const { query } = req;
        const response = { guid: query.guid };
        Change.find(query, (err, changes) => {
            if (err) {
                return res.send(err)
            }

            changes.forEach((change) => {
                changeHelper.buildResponseForCondition(change, response)
            })

            return res.json(response);
        });
    }


    function updateChange(req, res) {

        Change.findOne({ guid: req.query.guid, condition: req.query.condition }, (err, change) => {
            if (err) {
                return res.send(err)
            }

            const indexOfMeasurementsUpdate = findUpdateIndex(change.measurements, req.query.dateTime)
            change.measurements[indexOfMeasurementsUpdate] = { ...req.body, createdAt: req.query.dateTime }


            change.markModified('measurements');
            change.save();

            res
            return res.send('document updated')
        });
    }


    function findUpdateIndex(measurements, dateTime) {
        return measurements.findIndex((measurement) => {
            return measurement.createdAt === dateTime
        })
    }

    function deleteChange(req, res) {
        Change.findOne({ guid: req.query.guid, condition: req.query.condition }, (err, change) => {
            if (err) {
                return res.send(err)
            }

            const indexOfMeasurementsUpdate = findUpdateIndex(change.measurements, req.query.dateTime)
            const measurementToDelete = change.measurements[indexOfMeasurementsUpdate];
            if (measurementToDelete.isDeleted){
                return res.send(404);
            } 
            change.measurements[indexOfMeasurementsUpdate] = { ...measurementToDelete, isDeleted: true}

            change.markModified('measurements');
            change.save();

            return res.json('document deleted')
        });
    }

    return { postChange, getChanges, updateChange, deleteChange };
}

module.exports = changesController;