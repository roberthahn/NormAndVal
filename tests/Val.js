
require.paths.unshift('../vendor');
require.paths.unshift('../lib');

var vows            = require("vows");
var assert          = require("assert");
var core            = require("Val");

var suite           = vows.describe('Core Validation');

var testPhrase1;
var testPhrase2     = "abc 123 ABC !@#";
var testPhrase3     = "abc";
var validator1      = core.v6e(testPhrase1);
var validator2      = core.v6e(testPhrase2);
var validator3      = core.v6e(testPhrase3);

suite
    .addBatch({ 'undefined data not required; minLength test': minLengthTest(validator1, 1, 0)})
    .addBatch({ 'undefined data not required; maxLength test': maxLengthTest(validator1, 3, 0)})
    .addBatch({ 'undefined data not required; matches test': matchesTest(validator1, 0)})
    .addBatch({ 'undefined data now required': requiredTest(validator1, 1)})
    .addBatch({ 'undefined data now required; minLength test': minLengthTest(validator1, 1, 1)})
    .addBatch({ 'undefined data now required; maxLength test': maxLengthTest(validator1, 3, 1)})
    .addBatch({ 'undefined data now required; matches test': matchesTest(validator1, 1)})
    
    .addBatch({ 'defined data not required; minLength test': minLengthTest(validator2, 1, 0)})
    .addBatch({ 'defined data not required; minLength test fail': minLengthTest(validator2, 17, 1)})
    .addBatch({ 'defined data not required; maxLength test': maxLengthTest(validator2, 17, 1)})
    .addBatch({ 'defined data not required; maxLength test fail': maxLengthTest(validator2, 3, 2)})
    .addBatch({ 'defined data not required; matches test': matchesTest(validator2, 2)})
    .addBatch({ 'defined data now required': requiredTest(validator2, 2)})
    
    .addBatch({ 'defined data not required; matches test fail': matchesTest(validator3, 1)})
    .addBatch({ 'defined data not required; matches test on string only passes': matchesTest2(validator3, 1)})


    .run();

function minLengthTest(v, len, expectedErrLength) {
    return {
        topic: function () {
            v.minLength(len, 'err');
            return v.errors;
        },
        'should not raise an error': function (topic) {
            assert.equal(topic.length, expectedErrLength, ['there should be no errors [was: ', topic.length, '] [exp: ', expectedErrLength, ']'].join(''));
        }
    }
}

function maxLengthTest(v, len, expectedErrLength) {
    return { 
        topic: function () {
            v.maxLength(len, 'err');
            return v.errors;
        },
        'should not raise an error': function (topic) {
            assert.equal(topic.length, expectedErrLength, ['there should be no errors [was: ', topic.length, '] [exp: ', expectedErrLength, ']'].join(''));
        }
    }
}

function matchesTest2(v, expectedErrLength) {
    return {
        topic: function () {
            v.matches(testPhrase3).atLeast(1, 'err');
            return v.errors;
        },
        'should not raise an error': function (topic) {
            assert.equal(topic.length, expectedErrLength, ['there should be no errors [was: ', topic.length, '] [exp: ', expectedErrLength, ']'].join(''));
        }
    }
}

function matchesTest(v, expectedErrLength) {
    return {
        topic: function () {
            v.matches(/[a-z]+/, /\d+/, /[A-Z]+/, testPhrase2).atLeast(4, 'err');
            return v.errors;
        },
        'should not raise an error': function (topic) {
            assert.equal(topic.length, expectedErrLength, ['there should be no errors [was: ', topic.length, '] [exp: ', expectedErrLength, ']'].join(''));
        }
    }
}

function requiredTest(v, expectedErrLength) {
    return {
        topic: function () {
            v.required('err');
            return v.errors;
        },
        'should raise an error': function (topic) {
            assert.equal(topic.length, expectedErrLength, "there should be an error.");
            if(expectedErrLength > 0)
                assert.equal(topic[0], 'err', ["there should be an error called 'err'."].join(''));
        }
    }
}
