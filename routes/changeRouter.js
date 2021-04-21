const express = require('express');
const Change = require('../models/changes') //see if this can be removed
const changeController = require('../controllers/changeController');

function routes() {
    const changeRouter = express.Router();
    const controller = changeController(Change);
    changeRouter.route('/changes')
        .post(controller.postChange)
        .get(controller.getChanges)
        .delete(controller.deleteChange)

    return changeRouter;
}

module.exports = routes;