# NormAndVal
### Normalize your data to match common conventions; Validate your inputs; use the same libraries in Node.js *and* the browser.

Unlike many other data normalization and validation libraries, this one is not baked into an ORM, and is designed to work without change in both browser environments and Node.js.  This means you can use the exact same logic to normalize and validate data before it's submitted to the server, and double-check the data on the server.

## Norm.js

### Usage

Norm.js exposes one top-level static object, **n7e**. You don't need to create an instance of **n7e** before using it.

    // normalize phone numbers:
    n7e.NANP("5555555555") // returns 555-555-5555
    n7e.NANP("5555555555", true) // returns 1-555-555-5555

    // normalize phone numbers, Quebec-style:
    n7e.NANPQU("5555555555") // returns 555 555-5555
    n7e.NANPQU("5555555555", true) // returns 1 555 555-5555

    // normalize Canadian-style postal codes
    n7e.CAPostalCode("h0H0h0") // returns H0H 0H0

### Methods

**n7e.NANP(*string*, *includePrefix*)**: This method takes any *string* and attempts to extract a phone number formatted according to the North American Numbering Plan. Setting *includePrefix* to true will prefix the number with a 1.

**n7e.NANPQU(*string*, *includePrefix*)**: This is exactly the same as **NANP()** but adjusts the  format to Quebec norms. See the previous call for details on the arguments.

**n7e.CAPostalCode(*string*)**: takes a *string* and attempts to normalize it into a Canadian-style Postal Code.

**NOTE:** The line between data normalization and validation can become blurry.  For example, it's possible to normalize any 6-character string, like "string" into the Canadian postal code "STR ING".  It's the job of the validator to ensure the normalized output is actually a postal code. **Norm.js** is designed to get all data of a certain type into a single format - this simplifies validation, and, if the data *is* valid, will go into your data store 'clean'.

## Val.js

### Usage

    // create some data to validate
    var data = "Node.js is awesome";

    // create a data validator
    var dataValidator = v6e(data); 

    // now you can start testing it.
    dataValidator.minLength(1, "This data is too short! Make it longer");
    dataValidator.maxLength(18, "This data is too long! Make it shorter");
    dataValidator.matches("Node.js is awesome", /[a-z]*/, /[A-Z]*/, /\d+/, /\W+/).atLeast(3, "This data doesn't conform to standards!");

    // where are the errors?  Get them here:

    dataValidator.errors; // currently []

    // You can also chain calls:

    var errors = v6e("Val")
                    .minLength(1, "This is too short!")
                    .maxLength(4, "This is too long!")
                    .matches("Norm")
                    .atLeast(1, "it ain't Norm!")
                    .errors     // errors becomes [ "it ain't Norm!" ]

### Creating a validator

For each piece of data you want to validate, you need to create a validator.  A validator comprises of tests you can run on the data, and an error stack.  If any of the tests fail, an error message that you write is added to the error stack.

    // create some data to validate
    var data = "Node.js is awesome";

    // create a data validator
    var dataValidator = validate(data); 

### Attributes 

**errors[]** Any time one of the validation checks fail, error messages are pushed into this array.

    // display errors
    for(var i = 0; i < dataValidator.errors.length; i++) {
        console.log(dataValidator.errors[i]); // assumes Node.js or Firebug available for printing
    }

### Methods 

**required(*errorMsg*)** Used to check that there's data to validate. If the data you're trying to validate is undefined, an empty string, or false, then this will push *errorMsg* onto the errors stack.

    // ensure that data isn't empty
    dataValidator.required("Please give us some data"); // no error will be generated here

**minLength(*num*, *errMsg*)** Used to check that the data is at least *num* characters long.  If this check fails, then *errMsg* is pushed onto the error stack.

    // ensure the minLength constraint is met:
    dataValidator.minLength( 3, "You haven't supplied enough data"); // will be ok
    dataValidator.minLength( 20, "You haven't supplied enough data"); // will add an error to the stack

**maxLength(*num*, *errMsg*)** Used to check that the data is at most *num* characters long.  If this check fails, then *errMsg* is pushed onto the error stack.

    // ensure the maxLength constraint is met:
    dataValidator.maxLength(20, "You have supplied us with too much data"); // will be ok
    dataValidator.maxLength(3, "You have supplied us with too much data"); // will add an error to the stack

**matches(...).atLeast(*num*, *errMsg*)** Used to see that the data matches either literal strings or regular expressions.  matches() can take any number of strings or Regex objects, and will test each one in turn, keeping track of successful matches.  matches() does not itself push error messages onto the error stack; that job falls to the .atLeast() method.  It's designed to check for a minimum number of succsessful matches; if that threshold isn't met, then *errMsg* is pushed onto the error stack.

    // ensure everything matches
    dataValidator.matches(/node.js/i, /\d+/, /\w+/).atLeast(2, "Passphrase not secure enough"); // will be ok
    dataValidator.matches("Node.js is awesome").atLeast(1, "Passphrase not secure enough"); // will be ok
    dataValidator.matches(/node.js/i, /\d+/, /\w+/).atLeast(3, "Passphrase not secure enough"); // will add an error to the stack (there's no numbers in the string "Node.js is awesome")

**test( *test*, *errorMsg*)** Used by all the other functions to decide if an error message should be added to the stack. *test*s should be written so that they evaluate to a boolean, and if the test evaluates to true, then *errMsg* is pushed onto the error stack.

    // ensure that the test fails
    var testCase = (data != "Node.js is awesome"); // if this is true, then we have an error
    dataValidator.test(testCase, "Please update your data"); // will be ok

    var testCase = (data != "Node.js is really awesome"); // if this is true, then we have an error
    dataValidator.test(testCase, "Please update your data"); // will add an error to the stack

**NOTE:** if the data being validated is undefined or false, and you attempt to run anything other than **required()**, no errors will be pushed to the stack.  The reason for this is to cover off the possibility that that piece of data is not required. If it isn't required but there's also something there, then the tests will run as normal.

    // expected behaviour for undefined variables
    var data;
    var dataValidator = validate(data); // data is undefined
    dataValidator.minLength(5, "it's not long enough"); // Since data isn't defined, no error will be added to the error stack.

As a consequence of this design, if you require that someone gives you data, and they don't give it to you, then you'll only see the error message associated with the **required()** test.

## Package Notes

There are two package*json files. The default, **package.json**, specifies no dependencies. If you want to modify and/or extend this library (and you are encouraged to do so!), then overwrite **package.json** with **package-with-test-dep.json**; it includes a single dependency on **vows.js**.
