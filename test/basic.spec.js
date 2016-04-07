/*globals describe,it,before,beforeEach*/
var client = require('../'),
    assert = require('assert');

describe('selection', function() {

    it('should find the world morph', function(done) {
        this.timeout(5000);
        client
            .get('http://editor.netsblox.org')
            .inspect(worlds => {
                assert.equal(worlds.length, 1);
            })
            .end(done)
    });

    //it('should have an IDE_Morph', function(done) {
        //this.timeout(5000);
        //client
            //.get('http://editor.netsblox.org')
            //.find('.WorldMorph.IDE_Morph')
                //.should.not.be(null)
                //.end()
            //.end(done)
    //});

    //it.skip('should display "myRole@myRoom" initially', function(done) {
        //client
            //.get('http://localhost:8000')
            //.find('.WorldMorph.IDE_Morph')
                //.attr('projectName').equals('myRole@myRoom')
            //.end(done)
    //});

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
