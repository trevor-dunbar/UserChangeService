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

    async function getChanges(req, res) {
        const { query } = req;
        const response = { guid: query.guid };
        try {
            const changes = await Change.find(query)

            changes.forEach((change) => {
                getChangeService.buildResponseForCondition(change, response)
            })

            return res.json(response);
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async function deleteChange(req, res) {
        if (req.query.guid == undefined || req.query.condition == undefined) {
            res.status(400)
            return res.send('guid and condition are required')
        }
        if (typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
            res.status(400)
            return res.send('request body requires a record to delete')
        }
        try {
            const change = await  Change.findOne({ guid: req.query.guid, condition: req.query.condition })
            if (change) {
                updateChangeService.softDeleteMeasurement(req, change, res);
                return res.send()
            }
            else {
                res.status(404)
                return res.send('no record found with given query parameters');
            }
        } catch (err) {
            return res.send(err)
        }

    }

    return { postChange, getChanges, deleteChange };
}

module.exports = changesController;