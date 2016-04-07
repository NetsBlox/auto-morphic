/////////////// Expectations/Testing ///////////////
var Selection = require('./selection');
var Should = function(parent, negated) {
    this._id = parent._id;
    this._parent = parent;
    this.promise = parent.promise;

    if (negated !== true) {
        this.not = new Should(this._parent, true);
    }
    this.negated = negated === true;
};

Should.prototype.be = function(value) {
    if (this._parent._equals) {
        this.promise = this._parent._equals(value);
    } else {
        this.promise = this.promise
            .then(() => {
                return this.page().evaluate(utils.equal(this._id, value));
            })
    }

    this.promise = this.promise
        .then(res => {
            if (res !== !this.negated) {
                return Promise.reject(this._parent.toString() + ' should ' +
                    (this.negated ? 'not' : '') + ' be ' + value);
            }
        })
        .catch(err => {
            // This is not the ideal way to throw errors. Basically,
            // I am just skipping to the end...
            // FIXME
            var result = this._parent.root().done(Error(err));
            this._parent.root().done = nop;

            return Promise.reject(err);
        });

    return Selection.prototype.end.call(this);
};

Should.prototype.page = Selection.prototype.page;

module.exports = Should;
