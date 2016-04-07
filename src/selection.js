var getId = require('./utils').getId,
    utils = require('./morphic-test-utils');

var Selection = function(parent, selector) {
    var Should = require('./should');  // nested to avoid circular deps

    this._parent = parent;
    this.promise = parent.promise;
    this.done = parent.done;

    this._id = getId();

    // I need a reference to the root node to search from
    this._selector = selector;
    this._select(selector);

    this.should = new Should(this);
};

Selection.prototype = {};

// Retrieve the page from the current window
Selection.prototype.page = function() {
    return this.root()._page;
};

Selection.prototype.root = function() {
    var node = this;
    while (node._parent !== null) {
        node = node._parent;
    }
    return node;
};

Selection.prototype.toString = function() {
    return '["' + this._selector + '"]';
};

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

Selection.prototype._select = function(selector) {
    var root = this._parent._id;

    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.select(this._id, root, selector));
        });
};

Selection.prototype._equals = function(value) {
    this.promise = this.promise
        .then(() => {
                console.log('evaluating in _equals');
            return this.page().evaluate(utils.allEqual(this._id, value));
        });

    return this.promise;
};

Selection.prototype.find = function(selector) {
    // create the selection and return it
    return new Selection(this, selector);
};

Selection.prototype.click = function(selector) {
    // TODO
    return this;
};

Selection.prototype.attr = function(name) {
    var values = this.map(item => {
            return item[name];
        })
        .filter(attr => !!attr);

    return new Attributes(this, values);
};

Selection.prototype.end = function(fn) {
    // Clear memory
    // TODO

    if (fn) {
        this.promise.then(fn);
    }

    if (this._parent) {
        this._parent.promise = this.promise;
    }
    return this._parent;
};

module.exports = Selection;
