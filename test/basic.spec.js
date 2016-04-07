/*globals describe,it,before,beforeEach*/
var client = require('../'),
    assert = require('assert'),
    url = 'http://editor.netsblox.org';

describe('selection', function() {
    this.timeout(5000);

    it('should find the world morph', function(done) {
        client
            .get(url)
            .inspect(worlds => {
                assert.equal(worlds.length, 1);
            })
            .end(done)
    });

    describe('selectors', function() {

        it('should find using .CLASS_NAME', function(done) {
            client
                .get(url)
                .find('.NetsBloxMorph')
                    .inspect(ides => {
                        assert.equal(ides.length, 1);
                    })
                    .end()
                .end(done)
        });

        it('should find using nested .CLASS_NAME\'s', function(done) {
            client
                .get(url)
                .find('.NetsBloxMorph.StageMorph')
                    .inspect(result => {
                        var stage = result[0];
                        assert.equal(result.length, 1);
                        assert.equal(stage.name, 'Stage');
                    })
                    .end()
                .end(done)
        });
    });

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
    });

    it('should find PushButtonMorph', function(done) {
        // Click on the project menu
        client
            .get(url)
            // Get the controlBar
            .find('.NetsBloxMorph.PushButtonMorph')
                .should.not.be(null)
                .end()
            .end(done)
    });

    // Clicking
    it('should support clicking on elements', function(done) {
        // Click on the project menu
        client
            .get(url)
            // Get the controlBar
            .find('.NetsBloxMorph.PushButtonMorph[action="projectMenu"]')
                .click()
                .end()
            .find('.MenuMorph')
                .should.not.be(null)
                .end()
            .end(done)
    });

});
