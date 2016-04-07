// Class for things using the page
// Retrieve the page from the current window
var Page = function(parent) {
    this._parent = parent;
};

Page.prototype.page = function() {
    return this.root()._page;
};

Page.prototype.root = function() {
    var node = this;
    while (node._parent !== null) {
        node = node._parent;
    }
    return node;
};

module.exports = Page;
