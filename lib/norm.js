/**
 * n7e: Normalize object: the 'Norm' in 'NormAndVal'
 *
 * Note: to save typing and help keep the available namespace clearer in
 * browser-side JS, I picked n7e - 7 being the number of characters between the
 * 'n' and 'e' in 'normalize'
 *
 */
var n7e = {
    /**
     * NANP: North American Numbering Plan; use this to normalize phone numbers 
     * from countries and territories who paricipate in this numbering plan
     * (see http://en.wikipedia.org/wiki/Local_conventions_for_writing_telephone_numbers)
     *
     * @param val: any string that has 10 digits
     * @param cc: (optional) boolean -- if true, prepend a 1- to the number
     * @return: ###-###-#### or 1-###-###-#### or null if the input is less than 10 digits
     */
    NANP: function(val, cc) {
        var newVal = val.replace(/\D/g, '');

        if(newVal.length < 10) {
            return val;
        }

        cc = (cc)? "1":"";

        var phoneComponents = [ newVal.substr(0,3), newVal.substr(3,3), newVal.substr(6,4)];

        if(cc) {
            phoneComponents.unshift(cc);
        }

        return phoneComponents.join("-");
    },

    /**
     * NANPQU: North American Numbering Plan, Quebec-style.
     *
     * Works exactly as NANP but removes the first one or two hyphenss to conform to 
     * Quebec standards
     *
     * @param val: any string that has 10 digits
     * @param cc: (optional) boolean -- if true, prepend a 1- to the number
     * @return: ### ###-#### or 1 ### ###-#### or null if the input is less than 10 digits
     */
    NANPQU: function(val, cc) {
        var nanpValue = this.NANP(val, cc);
        if (nanpValue) {
            nanpValue = nanpValue.replace("-", " ");
            if(cc) {
                nanpValue = nanpValue.replace("-", " ");
            }

            return nanpValue;
        } else {
            return nanpValue;
        }
    },

    /**
     * CAPostalCode: Formats Canadian-style postal codes
     *
     * @param val: a string to format as a postal code
     * @return: a postal code of the format 'L#L #L#' 
     *          (where L is a capital letter, and # is a number)
     *          OR null if the input is bad.
     */
    CAPostalCode: function(val) {
        var newVal = val.toUpperCase();
        newVal = newVal.replace(/\W/g, '');

        if(newVal.length != 6) {
            return val;
        }

        return [ newVal.substr(0,3), newVal.substr(3,3) ].join(' ');
    }
}

try {
    exports.n7e = n7e;
} catch(e) {}

