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

        Change.findOneAndUpdate({ guid: req.query.guid, condition: req.query.condition }, dotify(req.body), (err, change) => {
            if (err) {
                return res.send(err)
            }

            return res.json('document updated')
        });
    }

    function deleteChange(req, res) {
        Change.findByIdAndDelete(req.params.changeId, (err, doc) => {
            if (err) {
                return res.send(err)
            }
            return res.status(204).send();
        })
    }

    return { postChange, getChanges, updateChange, deleteChange };
}

/**
 * Converts an object to a dotified object.
 *
 * @param obj         Object
 * @returns           Dotified Object
 */
function dotify(obj) {

    const res = {};

    function recurse(obj, current) {
        for (const key in obj) {
            const value = obj[key];
            const newKey = (current ? current + '.' + key : key);
            if (value && typeof value === 'object') {
                recurse(value, newKey);
            } else {
                res[newKey] = value;
            }
        }
    }

    recurse(obj);
    return res;
}

module.exports = changesController;