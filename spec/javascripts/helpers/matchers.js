beforeEach(function() {
  var matchers = {
    toBeFunction: function() {
      return this.actual instanceof Function;
    },
    toBeWithinOf: function(expected, delta) {
    return ((expected - delta) <= this.actual && (expected + delta) >= this.actual);
    }
  };

  this.addMatchers(matchers);
});
