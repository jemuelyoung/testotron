describe(calcNums, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof calcNums(571)).toBe('number');
    });
  });
});
describe(foo2, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo2('LOEmaFeCAdXJa')).toBe('string');
    });
  });
});
describe(foo3, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(Array.isArray(foo3([4,1,2,9,6,8,5,9]))).toBe(true);
    });
  });
});
