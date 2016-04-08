var phantom = require('phantom'),
    assert = require('assert'),
    path = require('path'),
    extend = require('object-concat'),
    utils = require('./morphic-test-utils'),
    helpersPath = path.join(__dirname, 'morphic-helpers.js'),
    Selection = require('./selection'),
    getId = require('./utils').getId,
    size = {width: 1024, height: 768},
    nop = () => {};

// TODO: Add logger

var World = function(url, done) {
    Selection.call(this, null, null);
    // using promises here so we can chain stuff
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

            // Prep for screenshots
            return this._page.property('viewPortSize', size);
        })
        .then(() => {
            this._page.property('viewPortSize').then(size => console.log(size));
            return this._page.property('clipRect', {
                top: 0,
                left: 0,
                width: 2000,
                height: 2000
            });
        })
        .then(res => {
            console.log('res:', res);
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
    return '[ WorldMorph ]';
};

// Overrides
World.prototype.end = function(fn) {
    Selection.prototype.end.call(this);
    this.done = fn || nop;
    return this.promise.then(() => {
        this.done();
        this._browser.exit();
    });
};

World.prototype._init = nop;

module.exports = {
    get: function(url, done) {
        return new World(url, done);
    }
};
