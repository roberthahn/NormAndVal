
require.paths.unshift('../vendor');
require.paths.unshift('../lib');

var vows            = require("vows");
var assert          = require("assert");
var core            = require("Norm");

var suite           = vows.describe('Core Normalization');

suite
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbers("ph:555- 555---5555 ext: 1234", false, "555-555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbers("(555) 555-5555", false, "555-555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbers("555.555.5555", false, "555-555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbers("(555) 555-5555", true, "1-555-555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbers("555.555.5555", true, "1-555-555-5555") })
    .addBatch({ 'Test Phone Number': shouldNotBePhoneNumbers("(55) 555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbersQU("(555) 555-5555", false, "555 555-5555") })
    .addBatch({ 'Test Phone Number': shouldBePhoneNumbersQU("(555) 555-5555", true, "1 555 555-5555") })


    .addBatch({ 'Test Postal Code': shouldBePostalCode("XXXXXX", "XXX XXX") })
    .addBatch({ 'Test Postal Code': shouldBePostalCode("xxxxxx", "XXX XXX") })
    .addBatch({ 'Test Postal Code': shouldBePostalCode("xxx xxx", "XXX XXX") })
    .addBatch({ 'Test Postal Code': shouldBePostalCode(" xxx  xxx ", "XXX XXX") })
    .addBatch({ 'Test Postal Code': shouldBePostalCode(" X1x  2x3 ", "X1X 2X3") })
    .addBatch({ 'Test Postal Code': shouldNotBePostalCode("90120") })
    .addBatch({ 'Test Postal Code': shouldNotBePostalCode("90120-1234") })


    .run();

function shouldBePhoneNumbers(test, cc, exp) {
    return {
            topic: function () {
                return core.n7e.NANP(test, cc);
            },
            'should be a formatted phone number': function(topic) {
                assert.equal (topic, exp);
            }
        }
}

function shouldBePhoneNumbersQU(test, cc, exp) {
    return {
            topic: function () {
                return core.n7e.NANPQU(test, cc);
            },
            'should be a formatted phone number': function(topic) {
                assert.equal (topic, exp);
            }
        }
}

function shouldNotBePhoneNumbers(test) {
    return {
            topic: function () {
                return core.n7e.NANP(test);
            },
            'should be the original data': function(topic) {
                assert.equal (topic, test);
            }
        }
}

function shouldBePostalCode(test, exp) {
    return {
            topic: function () {
                return core.n7e.CAPostalCode(test);
            },
            'should be a formatted postal code': function(topic) {
                assert.equal (topic, exp);
            }
        }
}

function shouldNotBePostalCode(test) {
    return {
            topic: function () {
                return core.n7e.CAPostalCode(test);
            },
            'should be the original data': function(topic) {
                assert.equal (topic, test);
            }
        }
}
