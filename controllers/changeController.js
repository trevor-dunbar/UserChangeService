function changesController(Change, getChangeService, postChangeService, updateChangeService) {

    function postChange(req, res) {
        const { guid } = req.body
        if (guid) {
            delete req.body.guid;

            const conditions = Object.entries(req.body);

            if (conditions.length !== 0) {

                conditions.forEach((condition) => { postChangeService.saveRecordForCondition(Change, guid, condition, res) })
                res.status(201)
                return res.send();
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
            if (change) {
                updateChangeService.softDeleteMeasurement(req, change, res);
    
                return res.json('document deleted')
            }

            res.status(404)
            return res.send('no record found with given query parameters');
        });
    }

    return { postChange, getChanges, deleteChange };
}

module.exports = changesController;