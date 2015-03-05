var expect = require("chai").expect
function Library() {
  this.libs = {}
}
Library.prototype.describe = function(name, deps, func) {
  this.libs[name] = func
}
Library.prototype.call = function(name, deps, injections) {
  this.do(deps, injections, this.libs[name])
}
Library.prototype.do = function(deps, injections, func) {
  var args = []
  for(var i=0; i<deps.length; i++) {
    var dep = deps[i]
    var arg = this.libs[dep]
    for (key in injections[dep] || {}) {
      arg[key] = injections[dep][key]
    }
    args.push(arg)
  }

  func.apply({}, args)
}

describe("a library with a library in it", function() {
  it("passes data to a function's dependencies when you call it", function() {

    var library = new Library()

    var hostFromInside

    library.describe("phone", [], {})
    library.describe("test-1", ["phone"], function(phone) {
      hostFromInside = phone.host
    })

    library.call("test-1", ["phone"], {phone: {host: "birdland:"}})

    expect(hostFromInside).to.equal("birdland:")
  })

  it("can run functions without naming them", function() {
    library = new Library()
    var ran = false
    library.do([], {}, function() {
      ran = true
    })
    expect(ran).to.be.true
  })

  it("passes in dependencies", function() {
    library = new Library()
    library.describe("sandwich", [], "yummy")
    var sandwichFromInside
    library.do(["sandwich"], {}, function(sandwich) {
      sandwichFromInside = sandwich
    })
    expect(sandwichFromInside).to.equal("yummy")
  })

  it.skip("can describe Bounty", function() {
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

