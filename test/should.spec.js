var client = require('../'),
    assert = require('assert'),
    url = 'http://dev.netsblox.org';

describe('"should"', function() {

    it('should support basic "should" syntax', function(done) {
        client
            .get(url)
            .find('.NetsBloxMorph')
                .should.not.be(null)
                .end()
            .end(done)
    });

    it('should support "should.have.length"', function(done) {
        client
            .get(url)
            .find('.NetsBloxMorph')
                .should.have.length(1)
                .end()
            .end(done)
    });

    it('should support chaining should\'s', function(done) {
        client
            .get(url)
            .find('.NetsBloxMorph')
                .should.have.length(1)
                .should.not.be(null)
                .end()
            .end(done)
    });

    it('should fail correctly', function(done) {
        client
            .get(url)
            .find('.NetsBloxMorph')
                .should.be(null)
                .end()
            .end(function(err) {
                if (err) {
                    done();
                } else {
                    done('should did not fail!');
                }
            });
    });
});

