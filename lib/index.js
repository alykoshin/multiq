'use strict';


const MultiQueue =  class {

  constructor(config) {
    config = config || {};
    this.timeout = (typeof config.timeout === 'number') ? config.timeout : 0;
    this.queues = {};
  }

  _sanitize(clientName) {
    if (!Array.isArray(this.queues[ clientName ])) this.queues[ clientName ] = [];
  }

  put(queueName, data, done) {
    this._sanitize(queueName);
    const timer = setTimeout(() => {
      done(new Error('Timeout in MultiQueue'));
    }, this.timeout);
    this.queues[ queueName ].push({ data, timer, done });
  }

  get(queueName, callback) {
    this._sanitize(queueName);
    let queueObj = this.queues[ queueName ].shift();
    if (!queueObj) callback(true); // queue is empty
    let { data, timer, done } = queueObj;
    clearTimeout(timer);
    callback(data, done);
  }

  length(queueName) {
    this._sanitize(queueName);
    return this.queues[ queueName ].length;
  }

  isEmpty(queueName) {
    this._sanitize(queueName);
    return this.length(queueName) === 0;
  }

};


module.exports = MultiQueue;
