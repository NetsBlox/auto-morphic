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

        it.skip('should find using nested .CLASS_NAME\'s', function(done) {
            client
                .get(url)
                .find('.NetsBloxMorph.StageMorph')
                    .inspect(result => {
                        var stage = result[0];
                        assert.equal(result.length, 1);
                        try {
                            assert.equal(stage.constructor.name, 'StageMorph');
                        } catch(e) {
                            console.log('failed :(');
                            assert(false, e);
                        }
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

    // Clicking
    it('should support clicking on elements', function(done) {
        // Click on the project menu
        client
            .get(url)
            .find('.NetsBloxMorph')
                .should.not.be(null)
                .end()
            .end(done)
    });

    // TODO

    //it.skip('should log in successfully', function(done) {
        //client
            //.get('http://localhost:8000')
            //.find('.WorldMorph.IDE_Morph.Morph#controlBar')
                //.find('#projectMenu')
                    //.click()
                    //.end()
                //.end()
            //.getPopup()
                //.find('#Login')
                //.click()
                //.end()
            //.getPopup()
                //.find('.InputFieldMorph')
                //// Fill in the username and password
                //// TODO
                ////
                //// Snap specific (DialogBoxMorph)
                ////.fillIn('User name:', username)
                ////.fillIn('Password:', password)
                ////
                ////.click('OK')
                //.find('.PushButtonMorph[target="  OK  "]')
                    //.click()
                    //.end()
                //.end()
            //.getPopup()
                //.assert.text('connected.')
                //.end()
            //.end(done)
    //});
});
