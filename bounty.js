var Library = require("./library")

describe("Bounty", function() {
  it("can tap a button", function() {
    var library = new Library()

    library.describe("phone", [], function() {
      function Phone() {}
      Phone.prototype.tap = function() {
      }
      return Phone
    })

    library.do(["phone"], {}, function(Phone) {
      var bobby = new Phone("Bobby's phone")
      bobby.tap("hello")
    })
  })
})