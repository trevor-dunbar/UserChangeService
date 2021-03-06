const should = require("should");
const sinon = require("sinon");
const controller = require("../controllers/changeController");

describe("changes controller", () => {
  describe("get changes", () => {
    it("getChange should call getChangeService and add the result to response", async () => {
      //given
      const req = { query: { guid: "123" } };
      const res = {
        json: sinon.spy(),
      };
      const dbResponse = [
        { guid: "123", condition: "diabetes", bloodPressure: 42, _id: 123 },
      ];

      const Change = require("../models/changes");
      sinon.stub(Change, "find");
      Change.find.resolves(dbResponse);

      const getChangeService = {
        buildResponseForCondition: sinon.spy(),
      };

      const changesController = controller(
        Change,
        getChangeService,
        null,
        null
      );

      //when
      await changesController.getChanges(req, res);

      //then
      getChangeService.buildResponseForCondition
        .calledWith(
          { guid: "123", condition: "diabetes", bloodPressure: 42, _id: 123 },
          { guid: "123" }
        )
        .should.equal(true);
      res.json.calledWith({ guid: "123" }).should.equal(true);
      sinon.restore();
    });

    it("getChange should call getChangeService TWICE and add the result to response", async () => {
      //given
      const req = { query: { guid: "123" } };
      const res = {
        json: sinon.spy(),
      };
      const dbResponse = [
        { guid: "123", condition: "diabetes", bloodPressure: 42, _id: 123 },
        { guid: "123", condition: "heartDisease", bloodPressure: 42, _id: 123 },
      ];

      const Change = require("../models/changes");
      sinon.stub(Change, "find");
      Change.find.resolves(dbResponse);

      const getChangeService = {
        buildResponseForCondition: sinon.spy(),
      };

      const changesController = controller(
        Change,
        getChangeService,
        null,
        null
      );

      //when
      await changesController.getChanges(req, res);

      //then
      getChangeService.buildResponseForCondition
        .calledWith(
          { guid: "123", condition: "diabetes", bloodPressure: 42, _id: 123 },
          { guid: "123" }
        )
        .should.equal(true);
      getChangeService.buildResponseForCondition
        .calledWith(
          {
            guid: "123",
            condition: "heartDisease",
            bloodPressure: 42,
            _id: 123,
          },
          { guid: "123" }
        )
        .should.equal(true);
      res.json.calledWith({ guid: "123" }).should.equal(true);
      sinon.restore();
    });

    it("should call send the error in the response if one occurs", async () => {
      //given
      const req = { query: { guid: "123" } };
      const res = {
        send: sinon.spy(),
      };

      const Change = require("../models/changes");
      const err = new Error("boom");
      sinon.stub(Change, "find").throws(err);

      const changesController = controller(
        Change,
        null,
        null,
        null
      );

      //when
      await changesController.getChanges(req, res);

      //then
      res.send.calledWith(err).should.equal(true);
      sinon.restore();
    });
  });

  describe("post changes", () => {
    it("should call postChangeService for each condition in the request", () => {
      //given
      const req = {
        body: {
          guid: "abc123",
          diabetes: { toDo: {} },
          heartDisease: { vitals: {} },
        },
      };
      const res = { status: sinon.spy(), send: sinon.spy() };
      const postChangeService = {
        saveRecordForCondition: sinon.spy(),
      };
      const changesController = controller(null, null, postChangeService, null);

      //when
      changesController.postChange(req, res);

      //then
      postChangeService.saveRecordForCondition
        .calledWith(null, "abc123", ["diabetes", { toDo: {} }], res)
        .should.equal(true);
      postChangeService.saveRecordForCondition
        .calledWith(null, "abc123", ["heartDisease", { vitals: {} }], res)
        .should.equal(true);
    });

    it("should send a 400 if there is no guid in the request body", () => {
      //given
      const req = { body: { condition: "diabetes" } };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const changesController = controller(null, null, null, null);

      //when
      changesController.postChange(req, res);

      //then
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith("guid and condition are required").should.equal(true);
    });

    it("should send a 400 if there is no measurements in the request body", () => {
      //given
      const req = { body: { guid: "abc123" } };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const changesController = controller(null, null, null, null);

      //when
      changesController.postChange(req, res);

      //then
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith("guid and condition are required").should.equal(true);
    });
  });

  describe("delete Change", () => {
    it("should send a document deleted and call update Change Service", async () => {
      //given
      const req = {
        query: { guid: "abc123", condition: "diabetes" },
        body: { bloodSugar: {key: 'val'} },
      };
      const res = { send: sinon.spy() };
      const dbResponse = { guid: "123", condition: "diabetes", bloodSugar: {key: 'val'}, _id: 123 };

      const Change = require("../models/changes");
      sinon.stub(Change, "findOne").resolves(dbResponse);

      const updateChangeService = {
        softDeleteMeasurement: sinon.spy(),
      };

      const changesController = controller(Change, null, null, updateChangeService);

      //when
      await changesController.deleteChange(req, res);

      //then
      updateChangeService.softDeleteMeasurement.calledWith(req, dbResponse, res).should.equal(true);
      res.send.calledOnce.should.equal(true);
      sinon.restore();
    });
    
    it("should send an err to response when fineOne throws an error", async () => {
      //given
      const req = {
        query: { guid: "abc123", condition: "diabetes" },
        body: { bloodSugar: {key: 'val'} },
      };
      const res = { send: sinon.spy() };

      const err = new Error('Boom');
      const Change = require("../models/changes");
      sinon.stub(Change, "findOne").throws(err);

      const changesController = controller(Change, null, null, null);

      //when
      await changesController.deleteChange(req, res);

      //then
      res.send.calledWith(err).should.equal(true);
      sinon.restore();
    });

    it("should send a 404 if the changes isnt found", async () => {
      //given
      const req = {
        query: { guid: "abc123", condition: "diabetes" },
        body: { bloodSugar: {} },
      };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const Change = require("../models/changes");
      sinon.stub(Change, "findOne").resolves(null);

      const changesController = controller(Change, null, null, null);

      //when
      await changesController.deleteChange(req, res);

      //then
      res.status.calledWith(404).should.equal(true);
      res.send.calledWith("no record found with given query parameters").should.equal(true);
      sinon.restore();
    });

    it("should send a 400 if there is no guid in the query params", () => {
      //given
      const reqWithoutGuid = {
        query: { condition: "diabetes" },
        body: { bloodSugar: {} },
      };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const changesController = controller(null, null, null, null);

      //when
      changesController.deleteChange(reqWithoutGuid, res);

      //then
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith("guid and condition are required").should.equal(true);
      sinon.restore();
    });
    
    it("should send a 400 if there is no condition in the query params", () => {
      //given
      const reqWithoutCondition = {
        query: { guid: '123' },
        body: { bloodSugar: {} },
      };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const changesController = controller(null, null, null, null);

      //when
      changesController.deleteChange(reqWithoutCondition, res);

      //then
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith("guid and condition are required").should.equal(true);
      sinon.restore();
    });
    
    it("should send a 400 if there is no req body", () => {
      //given
      const reqWithoutBody = {
        query: { guid: '123', condition: 'diabetes' },
      };
      const res = { status: sinon.spy(), send: sinon.spy() };

      const changesController = controller(null, null, null, null);

      //when
      changesController.deleteChange(reqWithoutBody, res);

      //then
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith("request body requires a record to delete").should.equal(true);
      sinon.restore();
    });
  });
});
