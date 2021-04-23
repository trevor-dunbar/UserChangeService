// const postChangeService = require('../service/postChangeService');
// const should = require('should');
// const sinon = require('sinon');

// describe('postChangeServiceTests', () => {
//     describe('saveRecordForCondition', () => {
//         it('should update a record when it finds one', () => {
//             //given
//             const dbResponse = {
//                 guid: '123',
//                 condition: 'diabetes'
//             }
//             const Change = require('../models/changes')
//             const stub = sinon.stub(Change);

//             Change.findOne.yields(null, dbResponse);
//             const res = {
//                 send: sinon.spy(),
//                 json: sinon.spy()
//             }
            
//             //when
//             postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

//             //then
//             sinon.assert.calledOnce(Change.findOneAndUpdate)
//             Change.findOne.restore()
//             // stub.restore()
//             // sinon.restore();
//         })
//     //     it('should CREATE a record when it DOES NOT finds one', () => {
//     //         //given
//     //         const Change = require('../models/changes')
//     //         const stub = sinon.stub(Change);
            
//     //         Change.findOne.yields(null, null);
//     //         const res = {
//     //             send: sinon.spy(),
//     //             json: sinon.spy()
//     //         }
            
//     //         //when
//     //         postChangeService.saveRecordForCondition(Change, '123', ['diabetes', { toDo: [{ dateTime: "now" }] }], res)

//     //         //then
//     //         sinon.assert.notCalled(Change.findOneAndUpdate)
//     //     })
//     })
// })