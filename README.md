[![npm version](https://badge.fury.io/js/multiq.svg)](http://badge.fury.io/js/multiq)
[![Build Status](https://travis-ci.org/alykoshin/multiq.svg)](https://travis-ci.org/alykoshin/multiq)
[![Coverage Status](https://coveralls.io/repos/alykoshin/multiq/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/multiq?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/multiq/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/multiq)
[![Inch CI](https://inch-ci.org/github/alykoshin/multiq.svg?branch=master)](https://inch-ci.org/github/alykoshin/multiq)

[![Dependency Status](https://david-dm.org/alykoshin/multiq/status.svg)](https://david-dm.org/alykoshin/multiq#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/multiq/dev-status.svg)](https://david-dm.org/alykoshin/multiq#info=devDependencies)


# multiq

Simple multiple queues implementation


If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/multiq/issues).


## Installation

```sh
npm install --save multiq
```

# Usage

## constructor `new Multiq(options)`

Syntax:

```js
const multiq = new Multiq({ timeout: 100 });
```

`options` object:
- `timeout` - `number` - value in milliseconds 


## `put(queueName, data, done)`

Method `put()` return number of documents matching query.

Syntax:

```js
multiq.put(queueName, data, done);
```

`queueName` - queue name

`data` - object to put into queue named `queueName` 

`done` - callback to be called after the element will be taken from the queue and processed (or after timeout reached)


## `get(queueName, callback)`

Method `put()` puts object into the queue named `queueName`.

Syntax:

```js
multiq.get(queueName, callback);
```

`queueName` - queue name

`callback` - callback to be called after the element will be processed.


## `length(queueName)`

Method `length()` returns number of objects in queue named `queueName`.

Syntax:

```js
console.log( multiq.length('some-queue') );
```

`queueName` - queue name


## `isEmpty(queueName)`

Method `isEmpty()` returns `true` if queue named `queueName` is empty, `false` otherwise.

Syntax:

```js
console.log( multiq.isEmpty('some-queue') );
```

`queueName` - queue name


# Examples:

```js
'use strict';

const Multiq = require('multiq');
//const Multiq = require('../');

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
```



## Credits
[Alexander](https://github.com/alykoshin/)


# Links to package pages:

[github.com](https://github.com/alykoshin/multiq) &nbsp; [npmjs.com](https://www.npmjs.com/package/multiq) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/multiq) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/multiq) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/multiq)


## License

MIT
