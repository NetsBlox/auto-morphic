var getId = require('./utils').getId,
    utils = require('./morphic-test-utils'),
    Q = require('q'),
    Remote = require('./remote'),
    nop = function(){};

var Selection = function(parent, selector) {
    var Should = require('./should');  // nested to avoid circular deps

    this._parent = parent;
    this._id = getId();

    // I need a reference to the root node to search from
    this._selector = selector;

    this.init();
    this.should = new Should(this);
};

Selection.SEARCH_DURATION = 5000;
Selection.prototype = new Remote();

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
        })
        .catch(err => {
            this.fail(err);
            return Promise.reject(err);
        });

    return this;
};

Selection.prototype.fail = function(err) {
    // This is not the ideal way to throw errors. Basically,
    // I am just skipping to the end...
    // FIXME
    var result = this.root().done(Error(err));
    this.root().done = nop;
};

Selection.prototype._select = function(selector) {
    var root = this._parent._id;

    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.select(this._id, root, selector));
        })
        .then(() => {
            var deferred = Q.defer(),
                start = Date.now(),
                query;

            // poll until timeout reached or a value is found
            query = (success, fail) => {
                return this.page().evaluate(utils.length(this._id))
                    .then(len => {
                        if (len !== 0) {
                            return success();
                        } else if ((Date.now() - start) > Selection.SEARCH_DURATION) {
                            return fail();
                        }
                        return setTimeout(query, 250, success, fail);
                    });
            };

            query(deferred.resolve, this.fail);
            return deferred.promise;
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

Selection.prototype.attr = function(name) {
    var Attribute = require('./attribute');
    return new Attribute(this, name);
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

    return Remote.prototype.end.apply(this, arguments);
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

module.exports = Selection;
