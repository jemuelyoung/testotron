Testotron 
=========

##### Automatically build Jasmine tests from your Javascipt code


Testotron reads your Javascript files and parses the [JSdoc](http://usejsdoc.org/) comments to create skeleton unit tests using the [Jasmine](http://jasmine.github.io/2.0/introduction.html) testing framework.


#### Example

This code gets parsed:

    /**
      * Triples your number.
      * @param {Number} num The number to triple
      * @return {Number}    The new number.
      */
    function calcNums(num) {
      var triple = 3 * num;
      return triple;
    }

and this Jasmine test gets generated:
    
    describe(calcNums, function() {
      describe('This is a test', function() {
        it('should do something', function() {
          expect(typeof foo(42)).toBe('number');
        });
      });
    });
    
    
    
#### Todo
AngularJS Support
