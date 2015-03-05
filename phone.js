var picture = require('./picture')

library.describe("phone", [], function() {
  function Phone() {}
  Phone.prototype.tap = function() {
  }
  return Phone
})

var report = library.test("Phone", ['phone', 'it', 'expect'], function(Phone, it, expect) {
  it("can tap a button", function() {
    var bobby = new Phone("Bobby's phone")
    bobby.tap("hello")
  })
})

picture.renderReport(report)