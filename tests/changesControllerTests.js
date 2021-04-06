const should = require('should');
const sinon = require('sinon');
const changesController = require('../controllers/changeController')

describe('changes controller tests', () => {
      describe('post Change tests', () => {
        it('should post a book', () => {
            //given
            const req = {
                body: { bloodPressure: 5, guid: 123, anyOtherKey: "any val" }
            }

            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }
            const Change = require('../models/changes')
            const controller = changesController(Change);

            //when
            controller.postChange(req, res);


            //then
            const change = new Change(req.body)
            res.status.calledWith(201).should.equal(true);
            res.json.calledWith(sinon.match(req.body)).should.equal(true)
        })

        it('should not post a book without a guid', () => {
            //given
            const Change = function (change) { this.save = () => { } };

            const req = {
                body: { bloodPressure: 5 }
            }

            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }
            const controller = changesController(Change);

            //when
            controller.postChange(req, res);

            //then
            res.status.calledWith(400).should.equal(true);
            res.send.calledWith('guid is required').should.equal(true)
        })
    })
    describe('Get changes tests', () => {
        it('should return a list of changes', () => {
            //given
            const req = {
                query: {bloodPressure: 42}
            };

            const res = {
                send: sinon.spy(),
                json: sinon.spy()
            }

            const dbResponse = [{bloodPressure: 42, _id: 123}];

            const Change = require('../models/changes')
            sinon.stub(Change, 'find');

            Change.find.yields(null, dbResponse);

            const controller = changesController(Change);

            //when
            controller.getChanges(req, res)

            //then
            res.json.calledWith(dbResponse).should.equal(true);

            Change.find.restore();
        })
    })
})