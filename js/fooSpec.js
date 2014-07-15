describe(calcNums, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof calcNums(42)).toBe('number');
    });
  });
});
describe(foo2, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo2('This is a test')).toBe('string');
    });
  });
});
