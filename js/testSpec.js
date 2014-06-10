// <%filename%>
describe(foo, function() {

  describe('This is a test', function() {
    it('should do something', function() {
      expect(typeof foo(42)).toBe('string')
    });
  });
});
