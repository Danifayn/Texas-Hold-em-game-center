/// <reference path="../typings/globals/jasmine/index.d.ts" />

describe("A suite is just a function", function() {
  var a;
  it("and so is a spec", function() {
    a = true;
    expect(a).toBe(false);
  });
});
