[![Build Status](https://travis-ci.org/NetsBlox/auto-morphic.svg?branch=master)](https://travis-ci.org/NetsBlox/auto-morphic)
[![Stories in Ready](https://badge.waffle.io/NetsBlox/auto-morphic.png?label=ready&title=Ready)](http://waffle.io/NetsBlox/auto-morphic)
# auto-morphic
Auto-morphic is a automated testing utility for [morphic.js](https://github.com/jmoenig/morphic.js).

As morphic does not use html elements (rather, it uses `Morph`s), existing frameworks cannot automate interaction with a morphic project. Auto-morphic provides a way to automate interaction on these types of sites. However, this requires some concepts, such as selectors (eg, '.myClass.otherClass' or '#myId'), being redesigned to fit the morphic context.

## Examples
A simple example of retrieving the `NetsBloxMorph`, the IDE in [netsblox](http://netsblox.org), is shown below:

```javascript
var client = require('auto-morphic'),
    assert = require('assert');

client
    .get('http://netsblox.org')
    .find('.NetsBloxMorph')
        .inspect(ides => {
            assert.equal(ides.length, 1);
        })
        .end()
    .end(() => {
        console.log('success!');
    })
```

More examples can be found in the `test/` directory. It is worth noting that this simply drives the browser and can be used with other testing frameworks. In the `test/` directory, I am using [mocha](http://mochajs.org)

