var phantom = require('phantom'),
    assert = require('assert'),
    path = require('path'),
    extend = require('object-concat'),
    utils = require('./morphic-test-utils'),
    helpersPath = path.join(__dirname, 'morphic-helpers.js'),
    Selection = require('./selection'),
    getId = require('./utils').getId,
    nop = () => {};

// TODO: Add logger

var World = function(url, done) {
    // using promises here so we can chain stuff
    this._parent = null;
    this._id = getId();

    this.done = nop;
    this.promise = phantom.create()
        .then(browser => {
            this._browser = browser;
            return this._browser.createPage();
        })
        .then(page => {
            this._page = page;

            this._page.property('onConsoleMessage', function(msg) {
                console.log(msg);
            });

            this._page.property('onError', function(msg) {
                console.log(msg);
            });

            return this.page().open(url);
        })
        .then(status => {
            return this.page().injectJs(helpersPath);
        })
        .then(status => {  // retrieve the world object
            assert(status, 'injecting the helpers failed');
            return this.page().evaluate(utils.selectWorlds(this._id));
        })
        .then(done || () => {})
        .catch(err => {
            console.error('Error in callback!', err);
            this._browser.exit();
        });
};

World.prototype = extend({}, Selection.prototype);


World.prototype.toString = function(fn) {
    return '[ World ]';
};

World.prototype.end = function(fn) {
    Selection.prototype.end.call(this);
    this.done = fn || nop;
    return this.promise.then(() => {
        this.done();
        this._browser.exit();
    });
};

module.exports = {
    get: function(url, done) {
        return new World(url, done);
    }
};
