const express = require('express');
const changeController = require('../controllers/changeController');

const Change = require('../models/changes')
const postChangeService = require('../service/postChangeService');
const getChangeService = require('../service/getChangeService');
const updateChangeService = require('../service/updateChangeService')

function routes() {
    const changeRouter = express.Router();
    const controller = changeController(Change, getChangeService, postChangeService, updateChangeService);
    
    changeRouter.route('/changes')
        .post(controller.postChange)
        .get(controller.getChanges)
        .delete(controller.deleteChange)

    return changeRouter;
}

module.exports = routes;