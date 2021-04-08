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
        // const conditions = ['diabetes', 'hypertension']
        //logic here
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

        Change.findOneAndUpdate({guid: req.query.guid, condition: req.query.condition}, dotify(req.body), (err, change) => {
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

    return { postChange, getChanges, getChangeById, updateChange, deleteChange };
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