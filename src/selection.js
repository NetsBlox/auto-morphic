var getId = require('./utils').getId,
    utils = require('./morphic-test-utils'),
    Remote = require('./remote');

var Selection = function(parent, selector) {
    var Should = require('./should');  // nested to avoid circular deps

    this._parent = parent;
    this._id = getId();

    // I need a reference to the root node to search from
    this._selector = selector;

    this._init();
    this.should = new Should(this);
};

Selection.prototype = new Remote();

Selection.prototype.end = function(fn) {
    if (fn) {
        this.promise = this.promise.then(fn);
    }

    // Clear memory
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.delete(this._id));
        });

    return Remote.prototype.end.apply(this, arguments);
};

/////////////////// Debug Helpers ///////////////////

Selection.prototype.inspect = function(fn) {
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.retrieve(this._id));
        })
        .then(res => {
            fn(res);
        });

    return this;
};

Selection.prototype.screenshot = function(filename) {
    this.promise = this.promise
        .then(() => {
            return this.page().render(filename);
        })
    return this;
};

/////////////////// Navigation ///////////////////
Selection.prototype.find = function(selector) {
    // create the selection and return it
    return new Selection(this, selector);
};

Selection.prototype.attr = function(name) {
    var Attribute = require('./attribute');
    return new Attribute(this, name);
};

/////////////////// Interactions ///////////////////
Selection.prototype.click = function() {
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.click(this._id));
        })
        .then(clicked => {
            if (!clicked) {
                var msg = `${this.toString()} is empty. Cannot click nothing.`;
                console.error(msg);
                throw Error(msg);
            }
        })

    return this;
};

Selection.prototype.type = function(text) {
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.type(this._id, text));
        })
        .then(typed => {
            if (!typed) {
                var msg = `${this.toString()} is empty. Cannot type without a context - is` +
                    ` your selection valid?.`;
                console.error(msg);
                throw Error(msg);
            }
        });
    return this;
};

/////////////////// Private API ///////////////////
Selection.prototype._init = function() {
    this.promise = this._parent.promise;
    this.done = this._parent.done;
    this._select(this._selector);
};

Selection.prototype.toString = function() {
    return '["' + this._selector + '"]';
};

Selection.prototype._select = function(selector) {
    var root = this._parent._id;

    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.select(this._id, root, selector));
        });
};

// Comparator
Selection.prototype._equals = function(value) {
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.allEqual(this._id, value));
        });

    return this.promise;
};

module.exports = Selection;
