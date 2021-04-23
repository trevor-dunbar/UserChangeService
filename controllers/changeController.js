function changesController(Change, getChangeService, postChangeService, updateChangeService) {

    function postChange(req, res) {
        const { guid } = req.body
        if (guid) {
            delete req.body.guid;

            const conditions = Object.entries(req.body);

            if (conditions) {

                conditions.forEach((condition) => { postChangeService.saveRecordForCondition(Change, guid, condition, res) })
                return res.status(201).send();
            }
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
                getChangeService.buildResponseForCondition(change, response)
            })

            return res.json(response);
        });
    }

    function deleteChange(req, res) {
        Change.findOne({ guid: req.query.guid, condition: req.query.condition }, (err, change) => {
            if (err) {
                return res.send(err)
            }
            updateChangeService.softDeleteMeasurement(req, change, res);

            return res.json('document deleted')
        });
    }

    return { postChange, getChanges, deleteChange };
}

module.exports = changesController;