/**
 * Created by alykoshin on 20.04.17.
 */

'use strict';

//const Multiq = require('multiq');
const Multiq = require('../');

const multiq = new Multiq({ timeout: 100 });

multiq.put('some-queue', { key: 'value'}, (err) => {
  if (err) return console.log('err:', err);
  console.log('done');
});

console.log('length:', multiq.length('some-queue') );

console.log('isEmpty:', multiq.isEmpty('some-queue') );

multiq.get('some-queue', (data, done) => {
  console.log('got data from queue:', data);
  done();
});
