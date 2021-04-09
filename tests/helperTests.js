// const changesController = require('../controllers/changeController');
// const expect  = require('chai').expect;


// describe("helper tests", () => {
//     it("should return dates in the last 7 days", () => {
//         const Change = require('../models/changes')
//         const controller = changesController(Change);
//         const input = {measurements: [{createdAt: "2021-03-08T20:14:35.312Z"}, {createdAt: "2021-04-07T20:14:35.312Z"}, {createdAt: "2021-04-08T20:14:35.312Z"}]}
//         const expected = [{createdAt: '2021-04-07T20:14:35.312Z'}, {createdAt: '2021-04-08T20:14:35.312Z'}]

//         const actual = controller.getWeeklyMeasurements(input);


//         expect(actual[0].createdAt).to.equal(expected[0].createdAt)
//         expect(actual[1].createdAt).to.equal(expected[1].createdAt)
//         expect(actual.length).to.equal(2);
//     })

//     it("should return dates since midnight", () => {
//         const Change = require('../models/changes')
//         const controller = changesController(Change);
//         const input = {measurements: [{createdAt: "2021-03-08T20:14:35.312Z"}, {createdAt: "2021-04-09T20:14:35.312Z"}, {createdAt: "2021-04-09T00:00:01.312Z"}, {createdAt: "2021-04-08T23:59:59.312Z"}]}
//         const expected = [{createdAt: '2021-04-09T20:14:35.312Z'}, {createdAt: "2021-04-09T00:00:01.312Z"}]

//         const actual = controller.getDailyMeasurements(input);


//         expect(actual[0].createdAt).to.equal(expected[0].createdAt)
//         expect(actual[1].createdAt).to.equal(expected[1].createdAt)
//         expect(actual.length).to.equal(2);
//     })
// })