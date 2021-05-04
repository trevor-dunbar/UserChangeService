async function parentFunction(req, res, next) {
    checkForErrors(req, next)
    await doSomethingAsync(req).catch(err => next(err))
    res.status(200).send()
}


//exception will bubble up and return to parents
async function doSomethingAsync(req) {
    await doSomethingThatMightFail(req)
}


//Dont catch this exception here, catch it with all other exceptions at the parent
function doSomethingThatMightFail(req) {
    if (req.query.fail === "true") {
        throw new Error('Internal Service Error')

    }
}


//throw custom errors
function checkForErrors(req, next) {
    if (!req.query.guid) {
        next(new BadRequest('Guid is required'))
        // throw new Bad
    }
}


//Create custom error classes 
class BadRequest extends Error {

    constructor(args) {

        super(args);

        this.name = "Bad Request"

    }

}

module.exports = { parentFunction }