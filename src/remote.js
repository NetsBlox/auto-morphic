// Base class for things using the page and chaining the promises

// Retrieve the page from the current window
var Remote = function(parent) {
    this._parent = parent;
};

Remote.prototype.page = function() {
    return this.root()._page;
};

Remote.prototype.root = function() {
    var node = this;
    while (node._parent !== null) {
        node = node._parent;
    }
    return node;
};

Remote.prototype.end = function() {
    if (this._parent) {
        this._parent.promise = this.promise;
    }
    return this._parent;
};

module.exports = Remote;
