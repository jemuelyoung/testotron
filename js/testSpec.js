// <%filename%>
describe(foo, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo(42)).toBe('number')
    });
  });
});
// <%filename%>
describe(foo2, function() {
  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo2('This is a test')).toBe('string')
    });
  });
});
