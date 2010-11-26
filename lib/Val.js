/**
 * v6e: Validate object; the 'Val' in 'NormAndVal'
 *
 * Note: to save typing and help keep the available namespace clearer in 
 * browser-side JS, I picked v6e - 6 being the number of characters between the 
 * 'v' and 'e' in 'validate'.
 *
 * @param val: a string to validate
 *
 * @return: a validation object that you can use to test 'val'
 */
var v6e = function(val) {
    return {
        errors: [],
        numMatches: null,

        /**
         * required: adds an error if val is undefined or has 0 length.
         *
         * NOTE: if the variable is null, undefined, or has 0 length,
         *       and is NOT required, then subsequent tests like minLength
         *       maxLength and matches will not raise an error.
         */
        required: function(errorMsg) {
            this.test( (!(val) || val.length == 0), errorMsg );
            return this;
        },

        /**
         * minLength: adds an error if val is not at least len elements long
         *
         * @param len: the minimum number of elements required.
         * @param errorMsg: optional; a string indicating the error message.
         */
        minLength: function (len, errorMsg) {
            if(val) this.test( (val.length < len), errorMsg );
            return this;
        },

        /**
         * maxLength: adds an error if val is not at most len elements long
         *
         * @param len: the maximum number of elements required.
         * @param errorMsg: optional; a string indicating the error message.
         */
        maxLength: function (len, errorMsg) {
            if(val) this.test( (val.length > len), errorMsg );
            return this;
        },

        /**
         * matches: attempts to match all strings and regexes and keeps track of how many  matched.
         *
         * @param [arguments]: all args are either regexes or strings to match
         *
         */
        matches: function () {
            if (!val) return this;

            this.numMatches = 0;
            for ( var i=0; i< arguments.length; i++ ) {
                var matchCriteria = arguments[i];
                var isError = false;
                switch(typeof(matchCriteria)) {
                    case 'string':
                        isError = this.test(matchCriteria != val);
                        break;
                    case 'function': // in Node.js
                    case 'object':   // in Firefox
                        isError = this.test(val.match(matchCriteria) == null);
                }

                if (!isError) {
                    this.numMatches++;
                }
            }

            return this;
        },
        

        /**
         * atLeast: checks to see if a minimum number of matches have been found
         *
         * @param howMany: the minimum number of matches to find.
         * @param errorMsg: optional; a string indicating the error message.
         */
        atLeast: function (howMany, errorMsg) {
            if (this.numMatches === null) return this;

            this.test( (this.numMatches < howMany), errorMsg );
            this.numMatches = null;
            return this;
        },

        /**
         * test: a generic test method. if you're going to use this, write tests that, if they PASS, then an error is recorded.
         *
         * @param test: a test that, if it PASSES, then you ADD an error to the errors list.
         * @param errorMsg: optional; a string indicating the error message.
         *
         * @return: if there is no errorMsg, returns the result of evaluating test.
         */
        test: function ( test, errorMsg) {
            if(test) {
                if (errorMsg) {
                    this.errors.push(errorMsg);
                } else {
                    return true; // there was an error
                }
            }
        }

    }

    /**
     * formats: canned RegExes for matching data that's typically difficult to write regexes for.
     *
     * Acknowlegements: Thanks to TJ Holowaychuk for these regexes; you can 
     *                  find them in his project Rapid - Redis ORM-ish api for nodejs
     */
    this.formats = {
        'url': /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
        'email': /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i,
        'postal-code': /^ *[a-zA-Z]\d[a-zA-Z] *\d[a-zA-Z]\d *$/
    }
}

try {
    exports.v6e = v6e;
} catch(e) {}

