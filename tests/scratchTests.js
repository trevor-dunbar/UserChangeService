const scratch = require('../service/scratch')
const sinon = require('sinon');
const should = require('should');

describe('scratch test', () => {
    it('should catch a 400 error', () => {
        //given
        const req = { body: {notGuid: '123'}}
        const res = { status: sinon.spy(), send: sinon.spy() }

        //when
        scratch.parentFunction(req, res)

        //then
        res.status.calledWith(400).should.equal(true)
        sinon.restore();
    })

    it('should catch a 500 error', async () => {
        //given
        const req = { body: {guid: '123'}}
        const res = { status: sinon.spy(), send: sinon.spy() }

        //when
        await scratch.parentFunction(req, res)

        //then
        console.log(res.status.getCalls())
        res.status.calledWith(500).should.equal(true)
        // res.send.calledWith().
    })
})