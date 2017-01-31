[![Build Status](https://travis-ci.org/NetsBlox/auto-morphic.svg?branch=master)](https://travis-ci.org/NetsBlox/auto-morphic)
[![Stories in Ready](https://badge.waffle.io/NetsBlox/auto-morphic.png?label=ready&title=Ready)](http://waffle.io/NetsBlox/auto-morphic)
# auto-morphic

[![Greenkeeper badge](https://badges.greenkeeper.io/NetsBlox/auto-morphic.svg)](https://greenkeeper.io/)
Auto-morphic is a automated testing utility for [morphic.js](https://github.com/jmoenig/morphic.js).

As morphic does not use html elements (rather, it uses `Morph`s), existing frameworks cannot automate interaction with a morphic project. Auto-morphic provides a way to automate interaction on these types of sites. However, this requires some concepts, such as selectors (eg, '.myClass.otherClass' or '#myId'), being redesigned to fit the morphic context.

## Examples
A simple example of retrieving the `NetsBloxMorph`, the IDE in [netsblox](https://netsblox.org), is shown below:

```javascript
var client = require('auto-morphic'),
    assert = require('assert');

client
    .get('https://editor.netsblox.org')
    .find('.NetsBloxMorph')
        .should.not.be(null)
        .end()
    .end(() => {
        console.log('success!');
    })
```

More examples can be found in the `test/` directory. It is worth noting that this simply drives the browser and can be used with other testing frameworks. In the `test/` directory, I am using [mocha](http://mochajs.org)

## Documentation
### client/auto-morphic (result of `require('auto-morphic')`)
#### get(url)
Opens the given url and selects all the `WorldMorph`'s defined in the global context.

__Arguments__
- `url` - website url to visit

__Returns__: _Selection_ object (with `WorldMorph`'s selected)

### Selection
Selections behave much like jquery objects. That is, they reference a list of elements (`Morph`'s) which match the selection criteria. Due the the remote nature of the execution environment (the actually tested environment is run in phantomjs), Selections simply reference objects on the client.

#### find(selector)
`find` searches the given selection for morphs matching the `selector`.

__Arguments__
- `selector` - a [Selector](#Selectors) string

__Returns__: a `Selection` of submorphs matching the `Selector` and contained in the parent `Selection`

#### should
`should` provides testing capabilities without the use of `inspect`.

__Returns__: a `Should` object w/ the given context

#### inspect(fn)
`inspect` retrieves the selection value from the client and passes it to the `fn` argument. Using `should` syntax is preferred as some values on the client may not be serializable.

__Arguments__
- `fn` - callback for the value of the Selection

__Returns__: `this`

#### end(fn)
`end` closes the Selection context and returns the parent context

__Arguments__
- `fn` - optional callback to be called before exiting - useful for passing `done` in mocha tests when ending the world selection.

__Returns__: parent context or `null`

## Should
Using "should" is preferred to `inspect` as `should` sends the value to the client and can avoid receiving empty selections due to serialization problems. Currently supported `should` syntax includes:

```javascript
selection.should.be(value);
selection.should.not.be(value);

selection.should.have.length(value);
```

## Selectors
Selectors provide search criteria for morphic nodes (much like in jquery). Current supported selectors:
- Class Selector (`.CLASS_NAME`): Finds the submorphs of the given type (using `morph.constructor.name`)
- Attribute Selector (`[ATTRIBUTE]` or `[ATTRIBUTE="value"]`): Finds the submorphs with the given attribute (`ATTRIBUTE`) equal to the javascript value (`"value"`) or the submorphs with the given attribute, if "value" is omitted

Selectors are parsed from left to right and the selection is created by iteratively applying each given selector in order.
