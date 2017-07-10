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

  _remove(queueName, queueObj) {
    const idx = this.queues[queueName].indexOf(queueObj);
    this.queues[queueName].splice(idx,1);
  }

  put(queueName, data, done) {
    this._sanitize(queueName);
    let queueObj = { data, timer:null, done };
    if (this.timeout) {
      queueObj.timer = setTimeout(() => {
        const err = new Error('Timeout in MultiQueue');
        err.code = 'timeout';
        this._remove(queueName, queueObj);
        if (typeof done === 'function') done(err);
        else console.log('WARN: unhandled timeout in Multiq, data:', data);
      }, this.timeout);
    }
    this.queues[ queueName ].push(queueObj);
  }

  peek(queueName, callback) {
    this._sanitize(queueName);
    let queueObj = this.queues[ queueName ][0];
    let data = queueObj ? queueObj.data : null;
    if (typeof callback === 'function') callback(null, data/*, done*/); // do not pass done for peek() method
    return data;
  }

  get(queueName, callback) {
    this._sanitize(queueName);
    let queueObj = this.queues[ queueName ].shift();
    if (!queueObj) {
      const err = new Error('Queue is empty');
      err.code = 'empty';
      if (typeof callback === 'function') callback(err); // queue is empty
      else throw err; // sync way
    }
    let { data, timer, done } = queueObj;
    if (this.timeout && timer) clearTimeout(timer);
    if (typeof callback === 'function') callback(null, data, done);
    return data;
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
