var picture = require("./picture")

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
    var arg = this.libs[dep]()
    for (key in injections[dep] || {}) {
      arg[key] = injections[dep][key]
    }
    args.push(arg)
  }

  func.apply({}, args)
}

picture.out("Library", function(it, expect) {
  it("passes data to a function's dependencies when you call it", function() {
    var library = new Library()

    var hostFromInside

    library.describe("phone", [], function() { return {}})
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
    library.describe("sandwich", [], function() { return "yummy" })
    var sandwichFromInside
    library.do(["sandwich"], {}, function(sandwich) {
      sandwichFromInside = sandwich
    })
    expect(sandwichFromInside).to.equal("yummy")
  })
})

picture.out("... running a test", function(it, expect) {
  library = new Library()
  library.describe("hatchery", [], function() { return "pengwings"})
  var report = library.test()
  // var report = library.test("Hatching", ["it", "hatchery", "expect"], 
  //  function(it, hatchery, expect) {
  //   it("hatches pengwings", function() {
  //     expect(hatchery()).to.equal("pengwings")
  //   })
  // })

  it("tests for pengwings", function() {
    expect(report.tests).to.have.length(1)
    expect(report.tests[0].description).to.equal("hatches pengwings")
    expect(reports.tests[0].success).to.be.true
  })
})

module.exports = Library