const express = require('express');
const changeController = require('../controllers/changeController');

const Change = require('../models/changes')
const postChangeService = require('../service/postChangeService');
const getChangeService = require('../service/getChangeService');
const updateChangeService = require('../service/updateChangeService')

function routes() {
    const changeRouter = express.Router();
    changeRouter.use(routerLogger)
    const controller = changeController(Change, getChangeService, postChangeService, updateChangeService);
    
    changeRouter.route('/changes')
        .post(controller.postChange)
        .get(controller.getChanges)
        .delete(controller.deleteChange)

    return changeRouter;
}

function routerLogger(req, res, next){
    const forGuid = req.query.guid ? ` for ${req.query.guid}` : '';
    console.log(`recieved ${req.method} request${forGuid}`)
    next();
}


module.exports = routes;