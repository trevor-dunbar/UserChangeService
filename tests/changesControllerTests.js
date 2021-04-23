const should = require('should');
const sinon = require('sinon');
const controller = require('../controllers/changeController')

describe('changes controller', () => {
    describe('get changes', () => {
        it('getChange should call getChangeService and add the result to response', () => {
            //given
            const req = { query: { guid: '123' } }
            const res = {
                json: sinon.spy()
            }
            const dbResponse = [{ guid: '123', condition: "diabetes", bloodPressure: 42, _id: 123 }];

            const Change = require('../models/changes')
            sinon.stub(Change, 'find');
            Change.find.yields(null, dbResponse);

            const getChangeService = {
                buildResponseForCondition: sinon.spy()
            }

            const changesController = controller(Change, getChangeService, null, null);

            //when
            changesController.getChanges(req, res)

            //then
            getChangeService.buildResponseForCondition.calledWith({ guid: '123', condition: "diabetes", bloodPressure: 42, _id: 123 }, {guid: '123'}).should.equal(true)
            res.json.calledWith({guid: '123'}).should.equal(true)
            sinon.restore()
        })

        it('getChange should call getChangeService TWICE and add the result to response', () => {
            //given
            const req = { query: { guid: '123' } }
            const res = {
                json: sinon.spy()
            }
            const dbResponse = [{ guid: '123', condition: "diabetes", bloodPressure: 42, _id: 123 },
            { guid: '123', condition: "heartDisease", bloodPressure: 42, _id: 123 }];

            const Change = require('../models/changes')
            sinon.stub(Change, 'find');
            Change.find.yields(null, dbResponse);

            const getChangeService = {
                buildResponseForCondition: sinon.spy()
            }

            const changesController = controller(Change, getChangeService, null, null);

            //when
            changesController.getChanges(req, res)

            //then
            getChangeService.buildResponseForCondition.calledWith({ guid: '123', condition: 'diabetes', bloodPressure: 42, _id: 123 }, {guid: '123'}).should.equal(true)
            getChangeService.buildResponseForCondition.calledWith({ guid: '123', condition: "heartDisease", bloodPressure: 42, _id: 123 }, {guid: '123'}).should.equal(true)
            res.json.calledWith({guid: '123'}).should.equal(true)
        })
    })
})