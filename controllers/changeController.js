function changesController(Change) {

    function postChange(req, res) {
        if (req.body.guid) {
            const change = new Change(req.body);

            change.save((err) => {
                if (err) return res.send(err);
            });

            res.status(201)
            return res.json(change);
        }
        res.status(400)
        return res.send('guid is required');
    }

    function getChanges(req, res) {
        const { query } = req;
        Change.find(query, (err, changes) => {
            if (err) {
                return res.send(err)
            }
            return res.json(changes);
        });
    }

    function getChangeById(req, res) {
        Change.findById(req.params.changeId, (err, change) => {
            if (err) {
                return res.send(err)
            }
            return res.json(change);
        });
    }

    function updateChange(req, res) {
        Change.findOneAndUpdate(req.params.changeId, req.body, (err, change) => {
            if (err) {
                return res.send(err)
            }

            return res.json(`document ${req.params.changeId} has been updated`)
        });
    }

    function deleteChange(req, res) {
        Change.findByIdAndDelete(req.params.changeId, (err) => {
            if (err) {
                return res.send(err)
            }
            return res.status(204)
        })
    }

    return { postChange, getChanges, getChangeById, updateChange, deleteChange };
}

module.exports = changesController;