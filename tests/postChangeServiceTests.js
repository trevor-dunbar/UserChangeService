const postChangeService = require("../service/postChangeService");
const should = require("should");
const sinon = require("sinon");

describe("postChangeServiceTests", () => {
  describe("saveRecordForCondition", () => {
    it("should update a record when it finds one", () => {
      //given
      const dbResponse = {
        guid: "123",
        condition: "diabetes",
        toDo: [{taskOne: {}}]
      };
      const Change = require("../models/changes");
      sinon.stub(Change, 'findOne');
      sinon.spy(Change, 'findOneAndUpdate')

    Change.findOne.yields(null, dbResponse);
    const res = {
        send: sinon.spy(),
        json: sinon.spy(),
    };
    
    //when
    postChangeService.saveRecordForCondition( Change, "123", ["diabetes", { toDo: [{ dateTime: "now" }] }], res  );

    
    //then
    Change.findOneAndUpdate.calledWith({ guid: '123', condition: 'diabetes' }, sinon.match.object, sinon.match.any).should.equal(true)
    Change.findOne.restore()
    Change.findOneAndUpdate.restore()
    });

    it('should CREATE a record when it DOES NOT finds one', () => {
        //given
        const Change = require('../models/changes')
        const save = sinon.stub(Change.prototype, 'save');
        const stub = sinon.stub(Change);

        Change.findOne.yields(null, null);
        const res = {
            send: sinon.spy(),
            json: sinon.spy()
        }

        //when
        postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

        //then
        sinon.assert.notCalled(Change.findOneAndUpdate)
        save.calledOnce.should.equal(true)
        Change.findOne.restore()
        Change.prototype.save.restore();
    })
  });
  describe('create DB object', () => {
    it('should add times for measurements when the value is an array and isUpdate true', () => {
      //given
      const { testables } = require('../service/postChangeService');
      const conditionKeyValue = ['diabetes', { bloodSugar: [{bloodSugarLevel: 123}, {bloodSugarLevel: 456}]}]
      const clock = sinon.useFakeTimers(new Date(2016,11,1).getTime()); //LAST THING 

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
