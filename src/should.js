/////////////// Expectations/Testing ///////////////
var Selection = require('./selection'),
    utils = require('./morphic-test-utils'),
    Remote = require('./remote');

var Should = function(parent, negated) {
    this._id = parent._id;
    this._parent = parent;
    this.promise = parent.promise;

    if (negated !== true) {
        this.not = new Should(this._parent, true);
    }
    this.negated = negated === true;

    this.have = new Have(parent);
};

Should.prototype = new Remote();

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
                return Promise.reject(this._parent.toString() + ' should' +
                    (this.negated ? ' not' : '') + ' be ' + JSON.stringify(value));
            }
        })
        .catch(err => {
            return this._parent.fail(err);
        });

    return this.end();
};

var Have = function(parent) {
    this._id = parent._id;
    this._parent = parent;
    this.promise = parent.promise;
};

Have.prototype = new Remote();

Have.prototype.length = function(value) {
    this.promise = this.promise
        .then(() => {
            return this.page().evaluate(utils.length(this._id));
        })
        .then(len => {
            if (len !== value) {
                return Promise.reject(this._parent.toString() + ' should ' +
                    `have length ${value} but has length ${len}`);
            }
        })
        .catch(err => {
            return this._parent.fail(err);
        });

    return this.end();
};

//Have.prototype.property = function(name, value) {
    // TODO
//};

Should.prototype.page = Selection.prototype.page;
Have.prototype.page = Selection.prototype.page;

module.exports = Should;
