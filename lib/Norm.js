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
     * nanp: North American Numbering Plan; use this to normalize phone numbers 
     * from countries and territories who paricipate in this numbering plan
     * (see http://en.wikipedia.org/wiki/Local_conventions_for_writing_telephone_numbers)
     *
     * @param val: any string that has 10 digits
     * @param ldac: (optional) boolean long distance area code -- if true, prepend 
     *              a 1- to the number
     * @return: ###-###-#### or 1-###-###-#### or null if the input is less than 10 digits
     */
    nanp: function(val, ldac) {
        var newVal = val.replace(/\D/g, '');

        if(newVal.length < 10) {
            return val;
        }

        ldac = (ldac)? "1":"";

        var phoneComponents = [ newVal.substr(0,3), newVal.substr(3,3), newVal.substr(6,4)];

        if(ldac) {
            phoneComponents.unshift(ldac);
        }

        return phoneComponents.join("-");
    },

    /**
     * nanpqu: North American Numbering Plan, Quebec-style.
     *
     * Works exactly as nanp() but removes the first one or two hyphenss to conform to 
     * Quebec standards
     *
     * @param val: any string that has 10 digits
     * @param ldac: (optional) boolean -- if true, prepend a 1- to the number
     * @return: ### ###-#### or 1 ### ###-#### or null if the input is less than 10 digits
     */
    nanpQU: function(val, ldac) {
        var nanpValue = this.nanp(val, ldac);
        if (nanpValue) {
            nanpValue = nanpValue.replace("-", " ");
            if(ldac) {
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
     * NOTE: if there's interest, we could expand on this to normalize
     *       postal codes from other countries. Here's a source for
     *       formats: http://en.wikipedia.org/wiki/Postal_code
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

