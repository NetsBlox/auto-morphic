var getId = require('./utils').getId,
    utils = require('./morphic-test-utils'),
    Page = require('./page');

var Selection = function(parent, selector) {
    var Should = require('./should');  // nested to avoid circular deps

    this._parent = parent;
    this._id = getId();

    // I need a reference to the root node to search from
    this._selector = selector;

    this.init();
    this.should = new Should(this);
};

Selection.prototype = new Page();

Selection.prototype.init = function() {
    this.promise = this._parent.promise;
    this.done = this._parent.done;
    this._select(this._selector);
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
            return this.page().evaluate(utils.allEqual(this._id, value));
        });

    return this.promise;
};

Selection.prototype.find = function(selector) {
    // create the selection and return it
    return new Selection(this, selector);
};

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

Selection.prototype.attr = function(name) {
    var values = this.map(item => {
            return item[name];
        })
        .filter(attr => !!attr);

    return new Attributes(this, values);
};

Selection.prototype.end = function(fn) {
    if (fn) {
        this.promise = this.promise.then(fn);
    }

    // Clear memory
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.delete(this._id));
        });

    if (this._parent) {
        this._parent.promise = this.promise;
    }
    return this._parent;
};

module.exports = Selection;
