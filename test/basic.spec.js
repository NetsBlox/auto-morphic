/*globals describe,it,before,beforeEach*/
var client = require('../'),
    assert = require('assert'),
    url = 'https://dev.netsblox.org',
    world;

describe('selection', function() {
    this.timeout(5000);

    before(function() {
        world = client.get(url);
    });

    afterEach(function() {
        world.refresh();
    });

    it.skip('should get the url', function(done) {
        client
            .get(url)
            .end(done);
    });

    it('should find the world morph', function(done) {
        world
            .inspect(worlds => {
                assert.equal(worlds.length, 1);
            })
            .end(done)
    });

    it('should find the world morph (using should)', function(done) {
        world
            .should.not.be(null)
            .end(done)
    });

    describe('selectors', function() {
        afterEach(function() {
            world.refresh();
        });

        it('should find using .CLASS_NAME', function(done) {
            world
                .find('.NetsBloxMorph')
                    .should.not.be(null)
                    .end()
                .end(done)
        });

        it('should find using nested .CLASS_NAME\'s', function(done) {
            world
                .find('.NetsBloxMorph.StageMorph')
                    .should.have.length(1)
                    .end()
                .end(done)
        });

        it('should find MenuItemMorph by labelString', function(done) {
            world
                // Get the controlBar
                .find('.NetsBloxMorph.PushButtonMorph[action="cloudMenu"]')
                    .click()
                    .end()
                .find('.MenuMorph.MenuItemMorph[labelString="Login..."]')  // Login...
                    .should.have.length(1)
                    .end()
                .end(done)
        });

    });

    it('should clear memory on client on selection delete', function(done) {
        var wSelection,
            stageSelection,
            id;

        wSelection = world;
        id = wSelection._id;

        stageSelection = wSelection
            .find('.NetsBloxMorph.StageMorph')
            .inspect(res => {
                // Swap the pointers!
                wSelection._id = stageSelection._id;
                // After the stageSelection is cleared, the wSelection should be a null ptr
                assert(!!res);
            });


        // Terminate the stage selection
        stageSelection.end();

        wSelection.inspect(res => {
            assert(!res);
            wSelection._id = id;
            done();
        });
    });

    it('should find PushButtonMorph', function(done) {
        // Click on the project menu
        world
            // Get the controlBar
            .find('.NetsBloxMorph.PushButtonMorph')
                .should.not.be(null)
                .end()
            .end(done)
    });

    // Clicking
    describe('interaction', function() {
        afterEach(function() {
            world.refresh();
        });

        it('should support clicking on elements', function(done) {
            // Click on the project menu
            world
                // Get the controlBar
                .find('.NetsBloxMorph.PushButtonMorph[action="projectMenu"]')
                    .click()
                    .end()
                .find('.MenuMorph')
                    .should.not.be(null)
                    .end()
                .end(done)
        });

        it('should support entering text', function(done) {
            world
                // Click the cloud button
                .find('.NetsBloxMorph.PushButtonMorph[action="cloudMenu"]')
                    .click()
                    .end()

                // Select Login...
                .find('.MenuMorph.MenuItemMorph[labelString="Login..."]')
                    .should.have.length(1)
                    .click()
                    .end()

                // Fill in the Sign in dialog
                .find('.DialogBoxMorph[labelString="Sign in"]')
                    .should.have.length(1)
                    .find('.InputFieldMorph[key="user"]')
                        .should.have.length(1)
                        .end()
                    .type('hello')
                    .find('.InputFieldMorph[key="user"].StringFieldMorph')
                        .should.have.length(1)
                        .attr('text')
                            .should.not.be(null)
                            .attr('text')
                                .should.be('hello')
                                .end()
                            .end()
                        .end()
                    .end()
                .end(done)
        });

        it('should trigger callback w/ error if inspect fails', function(done) {
            world
                // Click the cloud button
                .find('.NetsBloxMorph.PushButtonMorph[action="cloudMenu"]')
                    .should.have.length(1)
                    .click()
                    .end()

                // Select Login...
                .find('.MenuMorph.MenuItemMorph[labelString="Login..."]')
                    .should.have.length(1)
                    .click()
                    .end()

                // Fill in the Sign in dialog
                .find('.DialogBoxMorph[labelString="Sign in"]')
                    .should.have.length(1)
                    .find('.InputFieldMorph[key="user"]')
                        .should.have.length(1)
                        .end()
                    .type('hello')
                    .find('.InputFieldMorph[key="user"].StringFieldMorph')
                        .should.have.length(1)
                        .attr('text')
                            .should.not.be(null)
                            .attr('text')
                                .should.be('hello')
                                .inspect(data => {
                                    var txt = data[0];
                                    assert.equal(txt, 'asdf', 'INSPECT_ERROR');
                                })
                                .end()
                            .end()
                        .end()
                    .end()
                .end(function(err) {
                    if (err.message.indexOf('INSPECT_ERROR') > -1) {
                        done();
                    } else {
                        done(Error('inspect failed silently'));
                    }
                });
        });
    });
});
