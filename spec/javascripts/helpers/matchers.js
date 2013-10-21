beforeEach(function() {
  var matchers = {
    toBeFunction: function() {
      return this.actual instanceof Function;
    }
  };

  this.addMatchers(matchers);
});
