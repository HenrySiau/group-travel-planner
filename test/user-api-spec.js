var assert = require('assert');
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when value is not present', function(){
            assert.equal([1,2,3].indexOf(4), -1);
        });
        it('should return 1', function(){
            assert.equal([1,2,3].indexOf(2), 1);
        });
    });
    describe('#.length', function(){
        it('should return 0 when given Array is empty', function(){
            assert.equal([].length, 0);
        });
    });
});