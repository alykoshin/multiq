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
        this._remove(queueName, queueObj);
        if (typeof done === 'function') done(err);
      }, this.timeout);
    }
    this.queues[ queueName ].push(queueObj);
  }

  get(queueName, callback) {
    this._sanitize(queueName);
    let queueObj = this.queues[ queueName ].shift();
    if (!queueObj) callback(true); // queue is empty
    let { data, timer, done } = queueObj;
    if (this.timeout && timer) clearTimeout(timer);
    if (typeof callback === 'function') callback(data, done);
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
