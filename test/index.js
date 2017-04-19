/* globals describe, before, beforeEach, after, afterEach, it */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
chai.should();
chai.use(require('chai-things')); //http://chaijs.com/plugins/chai-things

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


  it('get objects from queues without callbacks (sync)', function () {
    const multiq = new Multiq();
    const queueName = 'a';
    const data = { key: 'value' };
    multiq.put(queueName, data);
    let res = multiq.get(queueName, (data));
    expect(res).to.be.eql(data);
  });

  it('get objects from queues with callbacks (async)', function (done) {
    const multiq = new Multiq();
    const queueName = 'a';
    const data = { key: 'value' };
    multiq.put(queueName, data, (err) => {
      // doneCallback
      done(err); // must return no error
    });
    multiq.get(queueName, (res, doneCallback) => {
      expect(res).to.be.eql(data);
      doneCallback();
    });
  });

  it('handle timeout', function (done) {
    const multiq = new Multiq({ timeout: 1 });
    const queueName = 'a';
    const data = { key: 'value' };
    multiq.put(queueName, data, (err) => {
      // doneCallback
      expect(err).to.be.an('error');
      expect(multiq.length(queueName)).to.be.equal(0);
      done();
    });
  });



});
