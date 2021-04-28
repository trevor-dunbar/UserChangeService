const postChangeService = require("../service/postChangeService");
const should = require("should");
const sinon = require("sinon");

describe("postChangeServiceTests", () => {
  describe("saveRecordForCondition", () => {
    it("should update a record when it finds one", async () => {
      //given
      const dbResponse = {
        guid: "123",
        condition: "diabetes",
        toDo: [{taskOne: {}}]
      };

      const Change = require("../models/changes");
      sinon.stub(Change, 'findOne').resolves(dbResponse);
      sinon.spy(Change, 'findOneAndUpdate')

    const res = {
        send: sinon.spy(),
        json: sinon.spy(),
    };
    
    //when
    await postChangeService.saveRecordForCondition( Change, "123", ["diabetes", { toDo: [{ dateTime: "now" }] }], res  );

    
    //then
    Change.findOneAndUpdate.calledWith({ guid: '123', condition: 'diabetes' }, sinon.match.object).should.equal(true)
    Change.findOne.restore()
    Change.findOneAndUpdate.restore()
    });

    it('should CREATE a record when it DOES NOT finds one', async () => {
        //given
        const Change = require('../models/changes')
        const save = sinon.stub(Change.prototype, 'save');
        const stub = sinon.stub(Change, 'findOne').resolves(null);
        const res = {
            send: sinon.spy(),
            json: sinon.spy()
        }

        //when
        await postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

        //then
        save.calledOnce.should.equal(true)
        Change.findOne.restore()
        Change.prototype.save.restore();
    })

    it('should send the error in the response when find one throws an error', async () => {
      //given
      const error = new Error('Boom')

      const Change = require('../models/changes')
      const stub = sinon.stub(Change, 'findOne').throws(error);

      const res = {
          send: sinon.spy(),
          json: sinon.spy()
      }

      //when
      await postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

      //then
      res.send.calledWith(error).should.equal(true)
      Change.findOne.restore()
    })
    
    it('should send the error in the response when find one and update throws an error', async () => {
      //given
      const Change = require('../models/changes')
      const stub = sinon.stub(Change);

      const error = new Error('Boom')
      const dbResponse = {
        guid: "123",
        condition: "diabetes",
        toDo: [{taskOne: {}}]
      };

      Change.findOne.resolves(dbResponse);
      Change.findOneAndUpdate.throws(error)

      const res = {
          send: sinon.spy(),
          json: sinon.spy()
      }

      //when
      await postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

      //then
      res.send.calledWith(error).should.equal(true)
      Change.findOne.restore()
      Change.findOneAndUpdate.restore()
    })

    it('should send the error in the response when save throws an error', async () => {
      //given
      const Change = require('../models/changes')
      const stub = sinon.stub(Change, 'findOne').resolves(null);
      const save = sinon.stub(Change.prototype, 'save')
      const error = new Error('Boom')

      save.throws(error)

      const res = {
          send: sinon.spy(),
          json: sinon.spy()
      }

      //when
      await postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

      //then
      res.send.calledWith(error).should.equal(true)
      Change.findOne.restore()
      Change.prototype.save.restore()
    })
  });
  describe('create DB object', () => {
    it('should add times for measurements when the value is an array and isUpdate true', () => {
      //given
      const { testables } = require('../service/postChangeService');
      const conditionKeyValue = ['diabetes', { bloodSugar: [{bloodSugarLevel: 123}, {bloodSugarLevel: 456}]}]
      const clock = sinon.useFakeTimers(new Date(2016,11,1).getTime());  

      const expected = {
        bloodSugar: {
          $each: [
            { bloodSugarLevel: 123, dateTime: '2016-12-01T05:00:00.000Z' },
            { bloodSugarLevel: 456, dateTime: '2016-12-01T05:00:00.000Z' } 
          ]
        }
      }

      //when
      const actual = testables.createDBOBject(conditionKeyValue, true);

      //then
      actual.should.eql(expected)
      clock.restore()
    })

    it('should add times for measurements when the value is an array and isUpdate FALSE', () => {
      //given
      const { testables } = require('../service/postChangeService');
      const conditionKeyValue = ['diabetes', { bloodSugar: [{bloodSugarLevel: 123}, {bloodSugarLevel: 456}]}]
      const clock = sinon.useFakeTimers(new Date(2016,11,1).getTime()); 
      const expected = {
        bloodSugar: [
            { bloodSugarLevel: 123, dateTime: '2016-12-01T05:00:00.000Z' },
            { bloodSugarLevel: 456, dateTime: '2016-12-01T05:00:00.000Z' } 
          ]
      }

      //when
      const actual = testables.createDBOBject(conditionKeyValue, false);

      //then
      actual.should.eql(expected)
      clock.restore()
    })

    it('should add times for measurements when the value is an object and isUpdate TRUE', () => {
      //given
      const { testables } = require('../service/postChangeService');
      const conditionKeyValue = ['diabetes', { vitals: { takenMedication: true } }]
      const clock = sinon.useFakeTimers(new Date(2016,11,1).getTime()); 
      const expected = {
        vitals: { takenMedication: true, dateTime: '2016-12-01T05:00:00.000Z' }
      }

      //when
      const actual = testables.createDBOBject(conditionKeyValue, true);

      //then
      actual.should.eql(expected)
      clock.restore()
    })

    it('should add times for measurements when the value is an object and isUpdate FALSE', () => {
      //given
      const { testables } = require('../service/postChangeService');
      const conditionKeyValue = ['diabetes', { vitals: { takenMedication: true } }]
      const clock = sinon.useFakeTimers(new Date(2016,11,1).getTime()); 
      const expected = {
        vitals: [{ takenMedication: true, dateTime: '2016-12-01T05:00:00.000Z' }]
      }

      //when
      const actual = testables.createDBOBject(conditionKeyValue, false);

      //then
      actual.should.eql(expected)
      clock.restore()
    })
  })
});
