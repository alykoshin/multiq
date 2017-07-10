/* globals describe, before, beforeEach, after, afterEach, it */

'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
chai.should();
chai.use(require('chai-things')); //http://chaijs.com/plugins/chai-things
const sinon  = require('mocha-sinon');


const Multiq = require('../');


describe('multiq', function () {

  before('before', function () {

  });

  beforeEach('beforeEach', function () {

  });

  afterEach('afterEach', function () {

  });

  after('after', function () {

  });

  it('creates correct object', function () {
    const multiq = new Multiq();
    expect(multiq).to.be.an('object');
    expect(multiq.timeout).to.be.equal(0);
    expect(multiq.put).to.be.a('function');
    expect(multiq.get).to.be.a('function');
    expect(multiq.length).to.be.a('function');
    expect(multiq.isEmpty).to.be.a('function');

  });

  it('puts objects to queues', function () {
    const multiq = new Multiq();
    expect(multiq.isEmpty('a')).to.be.equal(true);
    expect(multiq.isEmpty('b')).to.be.equal(true);

    expect(multiq.length('a')).to.be.equal(0);
    expect(multiq.length('b')).to.be.equal(0);
    multiq.put('a');
    expect(multiq.length('a')).to.be.equal(1);
    multiq.put('b');
    expect(multiq.length('b')).to.be.equal(1);
    multiq.put('b');
    expect(multiq.length('b')).to.be.equal(2);

    expect(multiq.isEmpty('a')).to.be.equal(false);
    expect(multiq.isEmpty('b')).to.be.equal(false);
  });


  it('peek null if empty (sync)', function () {
    const multiq = new Multiq();
    const queueName = 'a';
    const data = null;
    const res = multiq.peek(queueName);
    expect(res).to.be.eql(data);
  });

  it('peek object\'s data (sync)', function () {
    const multiq = new Multiq();
    const queueName = 'a';
    const data1 = { key1: 'value1' };
    const data2 = { key2: 'value2' };
    multiq.put(queueName, data1);
    multiq.put(queueName, data2);
    const res = multiq.peek(queueName);
    expect(res).to.be.eql(data1);
    console.log('multiq.length(queueName):',multiq.length(queueName))
    expect(multiq.length(queueName)).to.be.equal(2);
  });

  it('get objects from queues without callbacks (sync)', function () {
    const multiq = new Multiq();
    const queueName = 'a';
    const data1 = { key1: 'value1' };
    const data2 = { key2: 'value2' };
    multiq.put(queueName, data1);
    multiq.put(queueName, data2);
    const res = multiq.get(queueName, (data1));
    expect(res).to.be.eql(data1);
    expect(multiq.length(queueName)).to.be.equal(1);
  });

  it('get objects from empty queues without callbacks (sync)', function () {
    const multiq = new Multiq();
    const queueName = 'a';
    //const data = { key: 'value' };
    //multiq.put(queueName, data);
    expect(() => {
      const res = multiq.get(queueName);
    }).to.throw('is empty');
  });

  it('get objects from queues with callbacks (async)', function (done) {
    const multiq = new Multiq();
    const queueName = 'a';
    const data1 = { key1: 'value1' };
    const data2 = { key2: 'value2' };
    multiq.put(queueName, data1, (err) => {
      // doneCallback
      done(err); // must return no error
    });
    multiq.put(queueName, data2, (err) => {
      // doneCallback
      done(err); // must return no error
    });
    multiq.get(queueName, (err, res, doneCallback) => {
      expect(err).to.be.a('null');
      expect(res).to.be.eql(data1);
      expect(multiq.length(queueName)).to.be.equal(1);
      doneCallback();
    });
  });

  it('get objects from empty queue with callbacks (async)', function (done) {
    const multiq = new Multiq();
    const queueName = 'a';
    multiq.get(queueName, (err, res, doneCallback) => {
      expect(err).to.be.an('error');
      done();
    });
  });

  it('handle timeout (only async)', function (done) {
    const multiq = new Multiq({ timeout: 1 });
    const queueName = 'a';
    const data = { key: 'value' };
    multiq.put(queueName, data, (err) => {
      // doneCallback
      expect(err).to.be.an('error');
      expect(err.code).to.be.equal('timeout');
      //console.log('err:',err)
      expect(multiq.length(queueName)).to.be.equal(0);
      done();
    });
  });

  it('warns on timeout if callback not set or invalid', function (done) {
    const multiq = new Multiq({ timeout: 1 });
    const queueName = 'a';
    const data = { key: 'value' };
    const consoleLogStub = this.sinon.stub(console, 'log');
    //const consoleLogSpy = this.sinon.spy(console, 'log');
    multiq.put(queueName, data);
    setTimeout(() => {
      consoleLogStub.restore();
      expect( consoleLogStub.calledOnce ).to.be.true;
      expect( consoleLogStub.calledWithMatch('WARN') ).to.be.true;
      done();
    }, 100);
  });



});
