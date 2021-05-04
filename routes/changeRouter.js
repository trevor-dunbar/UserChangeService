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

    changeRouter.route('/measurements')
        .post(controller.postChange)
        .get(controller.getChanges)
        .delete(controller.deleteChange)

    changeRouter.route('/test')
        .get(require('../service/scratch').parentFunction)

    changeRouter.use(errorHandler)
    return changeRouter;
}

function routerLogger(req, res, next) {
    const forGuid = req.query.guid ? ` for ${req.query.guid}` : '';
    console.log(`recieved ${req.method} request${forGuid}`)
    next();
}

function errorHandler(err, req, res, next) {
    console.log(err)
    if (err.name == "Bad Request") { //handle custom error
        res.status(400)
        res.send(err)
        next()
    }
    if (err) {
        res.status(500)

        res.send("Internal Service Error")
        next()
    }
}


module.exports = routes;