var Selection = require('./selection'),
    utils = require('./morphic-test-utils'),
    extend = require('object-concat');

var Attribute = function(parent, attr) {
    Selection.apply(this, arguments);
};

Attribute.prototype = extend({}, Selection.prototype);

Attribute.prototype._select = function() {
    var root = this._parent._id;

    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.attr(this._id, root, this._selector));
        });
};

module.exports = Attribute;
