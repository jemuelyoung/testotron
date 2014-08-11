describe(calcNums, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof calcNums(572)).toBe('number');
    });
  });
});
describe(foo2, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo2('LvpcaYAV')).toBe('string');
    });
  });
});
describe(foo3, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(Array.isArray(foo3([6,7,6,10,10,8]))).toBe(true);
    });
  });
});
