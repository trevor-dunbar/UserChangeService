const updateChangeService = require("../service/updateChangeService")
const should = require("should");
const sinon = require("sinon");

describe('update change service', () => {
    describe('soft delete measurement', () => {
        it('should call save with the measurement from the request body soft deleted', () => {
            //given
            const change = {
                save: sinon.spy(),
                markModified: sinon.spy(),
                _doc: {
                    vitals: [{
                        takenMedication: true,
                        dateTime:'2016-12-01T05:00:00.000Z'
                    }]
                }
            }

            const req = { body: { vitals: { takenMedication: true, dateTime: '2016-12-01T05:00:00.000Z' } } };
            const res = null;

            //when
            updateChangeService.softDeleteMeasurement(req, change, res);


            //then
            change.save.calledOnce.should.equal(true);
            change.markModified.calledOnce.should.equal(true)
            change._doc.vitals[0].isDeleted.should.equal(true)
            sinon.restore()
        })

        it('should call send status 404 when there is no measurement in change which matches the request body', () => {
            //given
            const change = {
                save: sinon.spy(),
                markModified: sinon.spy(),
                _doc: {
                    vitals: [{
                        takenMedication: true,
                        dateTime:'2016-12-01T05:00:00.000Z'
                    }]
                }
            }

            const req = { body: { vitals: { takenMedication: false } } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            //when
            updateChangeService.softDeleteMeasurement(req, change, res);


            //then
            change.save.calledOnce.should.equal(false);
            change.markModified.calledOnce.should.equal(false)
            res.send.calledWith(404).should.equal(true)
            sinon.restore()
        })
    })
})