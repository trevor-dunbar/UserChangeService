const getChangeService = require('../service/getChangeService');
const should = require('should');
const sinon = require('sinon');

describe('getChangeServiceTests', () => {
    const now = new Date();
    const sixDaysAgo = new Date()
    sixDaysAgo.setDate(now.getDate() - 6);
    describe('buildResponseForCondition', () => {
        it('should add the changes fields to the response under daily and weekly measurements', () => {
            //given

            const change = {
                _doc: {
                    guid: '123',
                    condition: 'diabetes',
                    _id: 'id',
                    __v: 0,
                    toDo: [{ item: 1, dateTime: now.toISOString() },
                    { item: 2, dateTime: sixDaysAgo.toISOString() }]
                },
                condition: 'diabetes'
            }
            const response = { guid: '123' }
            const expected = {
                guid: '123',
                diabetes: {
                    dailyMeasurements: { toDo: [{ item: 1, dateTime: now.toISOString() }] },
                    weeklyMeasurements: {
                        toDo: [{ item: 1, dateTime: now.toISOString() },
                        { item: 2, dateTime: sixDaysAgo.toISOString() }]
                    }
                }
            }

            //when
            getChangeService.buildResponseForCondition(change, response);

            //then
            response.should.eql(expected)
        })
    })

    describe('daily and weekly filters', () => {
        it('should return changes since midnight', () => {
            //given
            const list = [{ item: 1, dateTime: now.toISOString() },
                { item: 2, dateTime: sixDaysAgo.toISOString() }]
            //when
            const actual = getChangeService.testables.getDailyMeasurements(list)
            
            //then
            actual.should.eql([{ item: 1, dateTime: now.toISOString() }])
        })

        it('should return changes since this week', () => {
            //given
            const eightDaysAgo = new Date();
            eightDaysAgo.setDate(now.getDate() - 8);

            const list = [{ item: 1, dateTime: eightDaysAgo.toISOString() },
                { item: 2, dateTime: sixDaysAgo.toISOString() }]
            
            //when
            const actual = getChangeService.testables.getWeeklyMeasurements(list)
            
            //then
            actual.should.eql([ { item: 2, dateTime: sixDaysAgo.toISOString() }])
        })
    })
})