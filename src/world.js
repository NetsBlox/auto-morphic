var webdriverio = require('webdriverio'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    extend = require('object-concat'),
    utils = require('./morphic-test-utils'),
    helpersPath = path.join(__dirname, 'morphic-helpers.js'),
    helpers = fs.readFileSync(helpersPath, 'utf8'),
    Selection = require('./selection'),
    getId = require('./utils').getId,
    opts = {
        screenshotPath: '../',
        screenshotOnReject: true,
        desiredCapabilities: {
            browserName: 'chrome'
        }
    },
    nop = () => {};

// TODO: Add logger

var World = function(url) {
    Selection.call(this, null, null);
    this._page = webdriverio
        .remote(opts)
        .init()
        .url(url);

    this.prepare();
};

World.prototype = extend({}, Selection.prototype);

World.prototype.prepare = function() {
    // using promises here so we can chain stuff
    this.promise = this.page().execute(helpers)
        .then(() => {
            console.log('about to select worlds...', this._id);
            return this.page().execute(utils.selectWorlds, this._id);
        })
        .then(count => {
            if (!count) {
                throw new Error('Could not find any worlds');
            }
            console.log('world count:', count.value);
        })
        .catch(err => {
            console.error('Error:', err);
        });
};

World.prototype.refresh = function() {
    this._page.refresh();
    this.prepare();
    return this;
};

World.prototype.toString = function(fn) {
    return '[ WorldMorph ]';
};

// Overrides
World.prototype.end = function(fn) {
    Selection.prototype.end.call(this);
    console.log('calling end w/', fn);
    this.done = fn || nop;
    return this.promise.then(() => {
        console.log('done!');
        this.done();
    });
};

World.prototype.init = nop;

module.exports = {
    get: function(url, done) {
        return new World(url, done);
    }
};
